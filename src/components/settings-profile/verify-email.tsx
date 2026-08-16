/* eslint-disable react/no-children-prop */
import { Alert, AlertAction, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { User } from "@/types";
import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useCountdownTimer } from "@/hooks/use-countdown-timer";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";

interface VerifyEmailProps {
    user: User;
}

export const VerifyEmail = ({ user }: VerifyEmailProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFirstSend, setIsFirstSend] = useState(true);

    const { timeLeft, hasEnded, startTimer } = useCountdownTimer();

    const form = useForm({
        defaultValues: {
            pin: "",
        },
        validators: {
            onSubmit: z.object({
                pin: z.string().min(6),
            }),
        },
        onSubmit: async ({ value }) => {
            try {
                setIsSubmitting(true);

                const { data } = await authClient.emailOtp.verifyEmail({
                    email: user.email,
                    otp: value.pin,
                });
                if (data?.status === true) {
                    toast.success("Email verify successfully");
                    form.reset();
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to verify OTP, please try again.");
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const onSendCode = async () => {
        const { data } = await authClient.emailOtp.sendVerificationOtp({
            email: user.email,
            type: "email-verification",
        });
        if (data?.success) {
            setIsFirstSend(false);
            startTimer();
            toast.success("The verification code has been sent");
        }
    };

    const onResendCode = async () => {
        const { data } = await authClient.emailOtp.sendVerificationOtp({
            email: user.email,
            type: "email-verification",
        });
        if (data?.success) {
            startTimer();
            toast.success("The verification code has been resent");
        }
    };

    return (
        <div className="space-y-2">
            {user.emailVerified ? (
                <Alert className="max-w-md border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-50">
                    <CheckCircle2Icon />
                    <AlertTitle className="font-medium">Verified account!</AlertTitle>
                </Alert>
            ) : (
                <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                    <AlertTriangleIcon />
                    <AlertTitle>Account not yet verified.</AlertTitle>
                    <AlertAction>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button size="xs" variant="outline">
                                    Verify now
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        form.handleSubmit();
                                    }}
                                    className="flex flex-col gap-3"
                                >
                                    <form.Field
                                        name="pin"
                                        children={(field) => {
                                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <FieldLabel htmlFor={field.name}>Verification code</FieldLabel>
                                                        {isFirstSend ? (
                                                            <Button variant="outline" size="xs" disabled={!hasEnded} onClick={onSendCode} type="button">
                                                                {!hasEnded && <span className="text-xs text-muted-foreground">({timeLeft}s)</span>}
                                                                Send otp
                                                            </Button>
                                                        ) : (
                                                            <Button variant="outline" size="xs" disabled={!hasEnded} onClick={onResendCode} type="button">
                                                                {!hasEnded && <span className="text-xs text-muted-foreground">({timeLeft}s)</span>}
                                                                Resend otp
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <InputOTP
                                                        maxLength={6}
                                                        id={field.name}
                                                        required
                                                        value={field.state.value}
                                                        onChange={(value) => {
                                                            field.handleChange(value);
                                                        }}
                                                        onBlur={field.handleBlur}
                                                        aria-invalid={isInvalid}
                                                    >
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={0} />
                                                            <InputOTPSlot index={1} />
                                                            <InputOTPSlot index={2} />
                                                        </InputOTPGroup>
                                                        <InputOTPSeparator />
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={3} />
                                                            <InputOTPSlot index={4} />
                                                            <InputOTPSlot index={5} />
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </Field>
                                            );
                                        }}
                                    />
                                    <Field>
                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            Verify
                                        </Button>
                                    </Field>
                                </form>
                            </PopoverContent>
                        </Popover>
                    </AlertAction>
                </Alert>
            )}
        </div>
    );
};
