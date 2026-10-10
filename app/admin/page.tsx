// app/admin/page.tsx  (server component)

import ClosedDaysManager from '@/components/admin/ClosedDaysManager';
import GroupFormulas from '@/components/admin/GroupFormulas';
import HolidaysChange from '@/components/admin/HolidaysChange';
import HomePage from '@/components/admin/HomePage';
import MenuChange from '@/components/admin/MenuChange';
import RubanAdmin from '@/components/admin/RubanAdmin';
import ScheduleChange from '@/components/admin/ScheduleChange';

import SignOutButton from '@/components/admin/SignOutButton'

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const revalidate = 0;


export default async function AdminPage() {
  console.log("Admin page loaded!");

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: 'latelier_de_lecharpe' },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {},   // obligatoire
        remove() {} // obligatoire
      }
    }
  )

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin, email, username')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) {
    console.log("Profile not found...");
    redirect('/admin/login');
  }

  if (!profile.is_admin) {
    console.log("User is not admin");
    redirect('/');
  }

  // OK : admin authentifié
  return (
    <div className='bg-cream flex flex-col items-center w-screen'>
      <RubanAdmin />
      
      <div className="w-4/5 md:w-2/3 mb-20 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="">
          <HomePage email={profile.email} />
        </div>
        <div className="">
          <SignOutButton />
        </div>
      </div>

      <section className='flex flex-col gap-20 w-4/5 md:w-2/3 mb-10'>
        <MenuChange />
        <ClosedDaysManager />
        {/* <GroupFormulas /> */}
        {/* <ScheduleChange /> */}
        {/* <HolidaysChange /> */}
      </section>
    </div>
  );
}
