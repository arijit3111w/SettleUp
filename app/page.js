import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURES, STEPS, TESTIMONIALS } from "@/lib/landing";
import { ArrowRight } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col pt-6 ">
      <section className="mt-20 pb-12 spacy-y-10 md:space-y-20 px-5">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6 ">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Settle Expenses Seamlessly!
          </Badge>
          <h1 className="gradient-title mx-auto max-w-4xl text-4xl font-bold md:text-7xl">
            The Smartest Way to Settle Expenses with Mates
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Easily track, split, and settle shared expenses with friends,
            family, or roommates. Whether it's a group trip, dinner, or rent,
            Settle Up helps you stay organized, pay your share, and avoid
            awkward money talks. Add expenses, assign splits, and keep
            everything fair — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Button
              asChild
              size={"lg"}
              className="bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size={"lg"}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 transition-colors"
            >
              <Link href="#how-it-works">How it works</Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl overflow-hidden rounded-xl shadow-xl">
          <div className="gradient p-1 aspect-[16/9]">
            <Image
              src="/hero.png"
              width={1280}
              height={720}
              alt="Banner"
              className="rounded-lg mx-auto"
              priority
            />
          </div>
        </div>
      </section>

      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6 ">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Features
          </Badge>

          <h2 className="gradient-title mt-2 text-3xl md:text-4xl font-bold">
            Everything You Need to Manage Shared Expenses
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
            SettleUp provides all tools you need to share expenses with ease.
          </p>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, Icon, bg, color, description }) => (
              <Card
                key={title}
                className="flex flex-col items-center space-y-4 p-6 text-center"
              >
                <div className={`rounded-full p-3 ${bg} `}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-500">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className=" py-20">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6 ">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            How it works
          </Badge>

          <h2 className="gradient-title mt-2 text-3xl md:text-4xl font-bold">
            Simple Steps to Settle Up with Friends
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Follow these easy steps to start managing your shared expenses
            today.
          </p>
          <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-3">
            {STEPS.map(({ label, title, description }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xl">
                  {label}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className=" bg-gray-50py-20">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6 ">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Testimonials
          </Badge>

          <h2 className="gradient-title mt-2 text-3xl md:text-4xl font-bold">
            What Our Users Say :
          </h2>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3 pb-20">
            {TESTIMONIALS.map(({ quote,name,role,image }) => (
              <Card key={name}>
                <CardContent className="space-y-4 p-6">
                  <p className="text-gray-500">{quote}</p>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={image} alt={name} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-sm text-muted-foreground">{role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient">
            <div className="container mx-auto px-4 md:px-6 text-center space-y-6 ">
                <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white">
                    Ready to Settle Up?
                </h2>
                <p className="mx-auto max-w-[700px] text-green-100 md:text-xl/relaxed">
                    Join thousands of users who are simplifying their shared expenses.
                </p>

                <Button asChild size="lg" className="bg-green-800 hover:opacity-90">
                    <Link href="/dashboard">
                        Get Started Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>

            </div>
      </section>

    </div>
  );
}
