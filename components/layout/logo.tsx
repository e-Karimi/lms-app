import Image from "next/image";

const Logo = () => {
  return <Image height={0} width={0} style={{ width: "80%", height: "auto" }} alt="logo" src="/logo.svg" priority />;
};

export default Logo;
