import dynamic from 'next/dynamic';

const DynamicAuthFlow = dynamic(() => import('@/components/auth/DynamicAuthFlow'), {
  ssr: false,
});

export default function LoginDynamicPage() {
  return <DynamicAuthFlow />;
}

