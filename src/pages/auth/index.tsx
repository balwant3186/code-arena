import Navbar from "@/components/Navbar/Navbar";
import React from "react";
import Image from "next/image";
import AuthModal from "@/components/Modals/AuthModal";
import { useRecoilValue } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";

type AuthPageProps = {};

const AuthPage: React.FC<AuthPageProps> = () => {
  const { isOpen, type } = useRecoilValue(authModalState);

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
