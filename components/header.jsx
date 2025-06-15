"use client"   //as in server components we cannot use hooks and logics 
import useStoreUser from '@/hooks/use-store-user'
import { SignedIn, SignedOut, SignIn, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { BarLoader } from 'react-spinners'
import { Authenticated, Unauthenticated } from 'convex/react'
import { Button } from './ui/button'
import { LayoutDashboard } from 'lucide-react'
import ThemeToggle from './theme-toggler'

const Header = () => {
    const {isLoading} = useStoreUser()
    const path = usePathname()   // use features while using home page

  return (
    <header className='fixed top-0 w-full border-b ng-white/95 backdrop-blur z-50 supports-[backdrop-filter]:bg-white/60'>
        <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
            <Link href='/' className='flex items-center gap-2'>
            <Image
                src="/logos/app-logo.png" 
                alt="Settleup Logo" 
                width={200} 
                height={60}
                className='h-15 w-auto object-contain'
            />
            <span className='logo-gradient logo-hover '>Settleup</span>
            
            </Link>

            
            {path === '/' && (
                <div className='hidden md:flex items-center gap-6'>
                    <Link href='#features'
                    className='text-sm font-medium hover:text-green-600 transition'>
                    Features</Link>
                    <Link href='#how-it-works'
                    className='text-sm font-medium hover:text-green-600 transition'>
                    How it works</Link>
                </div>
            )}

            <div className='flex items-center gap-4'>
                <ThemeToggle/>
                <Authenticated>
                    <Link href='/dashboard'>
                    <Button variant='outline' className='hidden md:inline-flex items-centre gap-2 hover:text-green-600
                     hover:border-green-600 transition'>
                    <LayoutDashboard className='h-4 w-4'/>
                    Dashboard
                    </Button>
                    <Button variant='ghost' className='md:hidden w-10 h-10 p-0'>
                        <LayoutDashboard className='h-4 w-4'/>
                    </Button>
                    </Link>
                    <UserButton/>
                </Authenticated>

                <Unauthenticated>
                    <SignInButton>
                        <Button variant={'ghost'}>Sign In</Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button className='bg-green-600 hover:bg-green-700 border-none'>Get Started</Button>
                    </SignUpButton>

                </Unauthenticated>
            </div>

        
        </nav>
        {isLoading && <BarLoader width={"100%"} color={"#36d7b7"}/>}
    </header>
  )
}

export default Header