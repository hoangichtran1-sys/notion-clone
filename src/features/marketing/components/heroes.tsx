import Image from "next/image";

export const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center">
                <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
                    <Image
                        src="/clumsy.svg"
                        fill
                        alt="Clumsy"
                        className="object-contain dark:hidden"
                    />
                    <Image
                        src="/clumsy-dark.svg"
                        fill
                        alt="Clumsy"
                        className="object-contain hidden dark:block"
                    />
                </div>
                <div className="relative h-[400px] w-[400px] hidden md:block">
                    <Image
                        src="/reading.svg"
                        fill
                        alt="Reading"
                        className="object-contain dark:hidden"
                    />
                    <Image
                        src="/reading-dark.svg"
                        fill
                        alt="Reading"
                        className="object-contain hidden dark:block"
                    />
                </div>
            </div>
        </div>
    );
};
