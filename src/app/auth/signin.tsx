"use client"

import { WalletButton } from '@rainbow-me/rainbowkit';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
  } from "next"
  import { getCsrfToken, signIn } from "next-auth/react"
import { useCallback, useState } from 'react';
import axios from 'axios';

export default function SignIn({
  csrfToken
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const onSignin = useCallback(() => {
      console.log(email, password)
        signIn("credentials", { email: email, password: password, callbackUrl:"/dashboard" })
    }, [email, password])

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Welcome to Malik's Trial Task</h1>
      <Input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
      <Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
      <Button onClick={onSignin}>Login</Button>
      <hr/>
      <WalletButton wallet="metamask" />
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    console.log(await getCsrfToken())
    return {
      props: {
        csrfToken: await getCsrfToken(),
      },
    }
  }