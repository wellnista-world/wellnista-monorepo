"use client"

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/api/supabaseClient';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };

    getUser();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  }
  return (
    <div className="flex flex-col  justify-center item-center bg-secondary text-neutral font-garet text-center">
      <h1 className=" text-center text-5xl font-magnolia font-bold text-primary mt-10">ยินดีต้อนรับเข้าสู่ Wellnista</h1>
      <p className="mt-5 text-center text-neutral text-lg font-garet font-semibold">
        Design your happier wellness life with AI-powered insights.
      </p>
      <div className="flex flex-col gap-4  justify-center">
        <div>
          {user ? (
            <div>
              <p>Welcome, {user.email}</p>
              <button onClick={signOut}>Sign Out</button>
            </div>
          ) : (
            <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
              Sign in with Google
            </button>
          )}
        </div>


      </div>
    </div>
    /* <Link href="book">
     <button className="py-10 w-80 text-3xl bg-primary text-secondary font-bold rounded-md hover:bg-accent">
       book testing
     </button>
   </Link> */
  );
}
