import Navbar from "@/components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AuthModal from "@/components/Modals/AuthModal";
import { useRecoilValue } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";

type AuthPageProps = {};

const AuthPage: React.FC<AuthPageProps> = () => {
  const { isOpen, type } = useRecoilValue(authModalState);

  const [user, loading, error] = useAuthState(auth);

  const [pageLoading, setPageLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/");
    if (!user && !loading) setPageLoading(false);
  }, [user, router, loading]);

  if (pageLoading) return null;

  return (
    <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <div className="flex items-center justify-center select-none pointer-events-none h-[calc(100vh - 5rem)]">
          <Image src="/hero.png" alt="" width={700} height={700} />
        </div>
        {isOpen && <AuthModal />}
      </div>
    </div>
  );
};
export default AuthPage;
