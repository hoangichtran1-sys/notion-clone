"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useCountdownTimer } from "@/hooks/use-countdown-timer";
import { useRouter } from "next/navigation";

function passwordStrength(password: string) {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
}

export const ForgotPassword = () => {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { timeLeft, hasEnded, startTimer } = useCountdownTimer();

    const onVerifyEmail = async () => {
        try {
            const { data, error } = await authClient.emailOtp.requestPasswordReset({
                email, // required
            });
            if (data?.success) {
                startTimer();
                toast.success("Email verify sucessfully");
                setStep(2);
            } else {
                throw error;
            }
        } catch (error) {
            console.error(error);
            toast.error("Faile to verify email");
        }
    };

    const onVerifyOptCode = async () => {
        try {
            const { data, error } = await authClient.emailOtp.checkVerificationOtp({
                email,
                type: "forget-password",
                otp: code,
            });
            if (data?.success) {
                toast.success("OTP verify sucessfully");
                setStep(3);
            } else {
                throw error;
            }
        } catch (error) {
            console.error(error);
            toast.error("Faile to verify OTP");
        }
    };

    const onResendCode = async () => {
        try {
            const { data, error } = await authClient.emailOtp.sendVerificationOtp({
                email, // required
                type: "forget-password",
            });
            if (data?.success) {
                startTimer();
                toast.success("The verification code has been resent");
            } else {
                throw error;
            }
        } catch (error) {
            console.error(error);
            toast.error("Faile to resend code");
        }
    };

    const onSetNewPassword = async () => {
        try {
            const { data, error } = await authClient.emailOtp.resetPassword({
                email,
                otp: code,
                password,
            });
            if (data?.success) {
                toast.success("Reset password successfully");
                setEmail("");
                setCode("");
                setPassword("");
                setStep(4);
            } else {
                throw error;
            }
        } catch (error) {
            console.error(error);
            toast.error("Faile to reset password, please try again.");
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <CardHeader className="pt-0 text-center">
                            <CardTitle className="text-2xl">Forgot password?</CardTitle>
                            <CardDescription>Enter your email address to reset your password</CardDescription>
                        </CardHeader>

                        <div className="flex flex-col gap-6">
                            <div className="relative">
                                <Input
                                    id="email-forgot-lp3-style"
                                    type="email"
                                    placeholder="me@example.com"
                                    className="bg-transparent ps-10 h-9 text-sm"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Mail className="text-muted-foreground absolute inset-s-3 top-1/2 size-5 -translate-y-1/2" />
                            </div>
                            <Button type="button" className="h-9 px-4 py-2 w-full cursor-pointer" onClick={onVerifyEmail} disabled={!email}>
                                Send Reset Code
                            </Button>
                            <p className="mt-6 flex justify-center gap-1 text-center text-sm">
                                <span>Donapos;t have an account yet?</span>
                                <Link href="/sign-up" className="underline underline-offset-4">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </>
                );

            case 2:
                return (
                    <>
                        <div className="mb-6 text-center">
                            <h1 className="mb-2 text-2xl font-bold tracking-tight text-balance">Check Your Email</h1>
                            <p className="text-muted-foreground text-sm text-balance">
                                Enter the 6-digit code sent to <span className="text-foreground font-medium">{email || "your email"}</span>.
                            </p>
                        </div>

                        <div className="flex flex-col gap-6">
                            <InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)}>
                                <InputOTPGroup className="grid w-full grid-cols-6 gap-2 sm:gap-3">
                                    <InputOTPSlot index={0} className="h-12 w-auto flex-1 rounded-md border-l text-lg" />
                                    <InputOTPSlot index={1} className="h-12 w-auto flex-1 rounded-md border-l text-lg" />
                                    <InputOTPSlot index={2} className="h-12 w-auto flex-1 rounded-md border-l text-lg" />
                                    <InputOTPSlot index={3} className="h-12 w-auto flex-1 rounded-md border-l text-lg" />
                                    <InputOTPSlot index={4} className="h-12 w-auto flex-1 rounded-md border-l text-lg" />
                                    <InputOTPSlot index={5} className="h-12 w-auto flex-1 rounded-md border-l text-lg" />
                                </InputOTPGroup>
                            </InputOTP>
                            <Button type="button" className="h-9 px-4 py-2 w-full cursor-pointer" onClick={onVerifyOptCode} disabled={code.length < 6}>
                                Verify Code
                            </Button>
                            <p className="text-muted-foreground text-center text-sm">
                                Didn&apos;t receive it?{" "}
                                <Button
                                    variant="link"
                                    className="cursor-pointer px-1 font-medium underline underline-offset-4 hover:underline"
                                    type="button"
                                    onClick={onResendCode}
                                    disabled={!hasEnded}
                                >
                                    Resend Code
                                </Button>
                                {!hasEnded && <span className="text-xs text-muted-foreground no-underline">({timeLeft}s)</span>}
                            </p>
                        </div>
                    </>
                );

            case 3: {
                const strength = passwordStrength(password);
                return (
                    <>
                        <div className="mb-6 text-center">
                            <h1 className="mb-2 text-2xl font-bold tracking-tight text-balance">Create New Password</h1>
                            <p className="text-muted-foreground text-sm text-balance">Choose a strong password for account security.</p>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="relative">
                                <Input
                                    id="new-password-forgot-lp3-style"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="bg-transparent ps-10 text-sm"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Lock className="text-muted-foreground absolute inset-s-3 top-1/2 size-5 -translate-y-1/2" />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-9 text-muted-foreground absolute inset-e-1 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-transparent"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </Button>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Progress value={strength} className="h-2" aria-label="Password strength indicator" />
                                <small className="text-muted-foreground block text-end text-xs">
                                    {strength === 0 ? "" : strength < 50 ? "Weak" : strength < 75 ? "Medium" : "Strong"}
                                </small>
                            </div>

                            <Button type="button" className="h-9 px-4 py-2 w-full cursor-pointer" onClick={onSetNewPassword} disabled={strength < 75}>
                                Set New Password
                            </Button>
                        </div>
                    </>
                );
            }

            case 4:
                return (
                    <>
                        <CardHeader className="mb-4 pt-0 text-center">
                            <CardTitle className="text-2xl">Congratulations</CardTitle>
                            <CardDescription>You successfully reset your password</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button
                                className="h-9 px-4 py-2 w-full cursor-pointer"
                                onClick={() => {
                                    //setStep(1);
                                    router.push("/sign-in");
                                }}
                            >
                                Back to login
                            </Button>
                        </CardFooter>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <section className="from-background to-muted/50 relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-linear-to-br">
            <div className="relative z-10 container mx-auto flex min-h-dvh items-center justify-center px-4 py-12 sm:py-16">
                <Card className="bg-background/80 relative w-full max-w-md ring-0 p-6 shadow-2xl backdrop-blur-md sm:p-8">
                    <div className="my-4 flex justify-center">
                        <div className="bg-secondary relative size-14 rounded-full border">
                            <div className="flex h-full items-center justify-center">
                                <Image src="/logo.svg" fill alt="Logo" className="dark:hidden" />
                                <Image src="/logo-dark.svg" fill alt="Logo Dark" className="hidden dark:block" />
                            </div>
                        </div>
                    </div>
                    {renderStepContent()}
                </Card>
            </div>
        </section>
    );
};
