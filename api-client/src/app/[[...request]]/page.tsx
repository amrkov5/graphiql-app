import Welcome from '../../Components/Welcome/Welcome';
import RestClient from '../../Components/RestClient/RestClient';
import GraphiQLClient from '@/Components/GraphiQLClient/GraphiQLClient';
import { METHODS } from '../../constants';
import { cookies } from 'next/headers';
import { customInitApp } from '@/firebase/firebase-admin-config';
import { auth } from 'firebase-admin';
import '../../firebase/firebase';
import { getUserName } from '../../firebase/firebase';
import NotFound from '@/Components/NotFound/NotFound';
import { fromBase64 } from '@/services/safeBase64';

customInitApp();

const ClientPage = async ({ params }: { params: { request?: string[] } }) => {
  if (!params.request) {
    let userName;
    const session = cookies().get('session')?.value || '';
    if (session) {
      try {
        const decodedToken = await auth().verifySessionCookie(session, true);
        if (decodedToken.uid) {
          userName = await getUserName(decodedToken.uid);
        }
      } catch {
        userName = null;
      }
    }
    return <Welcome userName={userName} />;
  } else if (params.request.length <= 3) {
    try {
      fromBase64(params.request[1] ?? '');
      fromBase64(params.request[2] ?? '');
      if (METHODS.includes(params.request[0])) {
        return (
          <RestClient
            propMethod={params.request[0]}
            propUrl={params.request[1]}
            propBody={params.request[2]}
          />
        );
      } else if (params.request[0] === 'GRAPHQL') {
        return (
          <GraphiQLClient
            propUrl={params.request[1]}
            propBody={params.request[2]}
          />
        );
      } else return <NotFound />;
    } catch {
      return <NotFound />;
    }
  } else return <NotFound />;
};

export default ClientPage;
