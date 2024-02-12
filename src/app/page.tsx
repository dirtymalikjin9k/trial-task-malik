import CustomLink from "@/components/custom-link"
import packageJSON from "../../package.json"
import { ConnectButton, WalletButton } from '@rainbow-me/rainbowkit';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Signin from "./auth/signin";

export default function Index() {
  return (
    <>
      <Signin />    
    </>
  )
}
