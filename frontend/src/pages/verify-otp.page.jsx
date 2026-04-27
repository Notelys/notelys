import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import usePageTitle from "../common/usePageTitle";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import api from "../common/api";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";

const VerifyOtp = () => {

    usePageTitle("Verify Email");

    const { setUserAuth } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [cooldown, setCooldown] = useState(60);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    // Redirect if no email in state (direct URL access)
    useEffect(() => {
        if (!email) {
            navigate("/signup", { replace: true });
        }
    }, [email, navigate]);

    // Cooldown timer for resend
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only last char
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Backspace — go to previous input
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        pasted.split("").forEach((char, i) => {
            newOtp[i] = char;
        });
        setOtp(newOtp);
        // Focus the last filled input
        const lastIndex = Math.min(pasted.length, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleVerify = (e) => {
        e.preventDefault();
        const otpString = otp.join("");

        if (otpString.length !== 6) {
            return toast.error("Please enter the complete 6-digit OTP");
        }

        setLoading(true);

        api.post("/verify-email", { email, otp: otpString })
        .then(({ data }) => {
            storeInSession("user", JSON.stringify(data));
            setUserAuth(data);
            toast.success("Email verified successfully!");
            navigate("/", { replace: true });
        })
        .catch(({ response }) => {
            toast.error(response?.data?.error || "Verification failed");
        })
        .finally(() => setLoading(false));
    };

    const handleResend = () => {
        if (cooldown > 0) return;

        api.post("/resend-otp", { email })
        .then(({ data }) => {
            toast.success(data.message || "OTP resent!");
            setCooldown(60);
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        })
        .catch(({ response }) => {
            toast.error(response?.data?.error || "Failed to resend OTP");
        });
    };

    if (!email) return null;

    return (
        <AnimationWrapper keyValue="verify-otp">
            <section className="h-cover flex items-center justify-center">

                <form className="w-[80%] max-w-[400px] text-center" onSubmit={handleVerify}>

                    <h1 className="text-4xl font-gelasio text-center mb-4">
                        Verify your email
                    </h1>

                    <p className="text-dark-grey text-lg mb-2">
                        We sent a 6-digit code to
                    </p>
                    <p className="text-black font-medium text-lg mb-10">
                        {email}
                    </p>

                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-3 mb-10" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleChange(index, e.target.value)}
                                onKeyDown={e => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold border-2 border-grey rounded-lg focus:border-black focus:outline-none bg-grey/30 transition-colors"
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    <button
                        className="btn-dark center w-full max-w-[300px]"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>

                    {/* Resend */}
                    <p className="mt-8 text-dark-grey text-lg">
                        Didn't receive the code?{" "}
                        {cooldown > 0 ? (
                            <span className="text-dark-grey/60">
                                Resend in {cooldown}s
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="underline text-black font-medium"
                            >
                                Resend OTP
                            </button>
                        )}
                    </p>

                    <p className="mt-4 text-dark-grey text-base">
                        Wrong email?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="underline text-black"
                        >
                            Go back
                        </button>
                    </p>

                </form>
            </section>
        </AnimationWrapper>
    );
};

export default VerifyOtp;
