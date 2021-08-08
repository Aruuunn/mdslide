import Head from "next/head";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import { DashboardNavbar } from "../../components"

export function Index() {


    return (
        <div>
            <Head>
                <title>Dashboard</title>
            </Head>
            <DashboardNavbar />
      </div>
    );
}


export default withPageAuthRequired(Index);


