import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ApplicationLayout } from './application-layout';
import { getEvents } from './data';
import { dark, neobrutalism } from '@clerk/themes';
import { AudioProvider } from '@/components/AudioProvider';
import { AudioPlayer } from '@/components/player/AudioPlayer';

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pomegranate',
  description: 'Pomegranate',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let events = await getEvents();

  return (
    <ClerkProvider>
      <html
        lang="en"
        className="antialiased text-zinc-950 lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
      >
        <head>
          <link rel="preconnect" href="https://rsms.me/" />
          <link
            rel="stylesheet"
            href="https://rsms.me/inter/inter.css"
          />
        </head>
        <body className="flex flex-col min-h-screen">
          <AudioProvider>
            <div className="flex-grow">
              <ApplicationLayout events={events}>
                {children}
              </ApplicationLayout>
            </div>
            <AudioPlayer />
          </AudioProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
