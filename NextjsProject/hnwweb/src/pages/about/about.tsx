    // pages/my-page.tsx
    import type { NextPage } from 'next';

    interface MyPageProps {
      title: string;
    }

    const MyNewPage: NextPage<MyPageProps> = ({ title }) => {
      return <h1>About</h1>;
    };

    export default MyNewPage;