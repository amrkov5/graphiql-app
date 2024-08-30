import { notFound } from 'next/navigation';
import Welcome from '../../Components/Welcome/Welcome';
import RestClient from '../../Components/RestClient/RestClient';
import { METHODS } from '../../constants';

const ClientPage = ({ params }: { params: { request?: string[] } }) => {
  if (!params.request) {
    return <Welcome />;
  } else if (params.request.length <= 3) {
    if (METHODS.includes(params.request[0])) {
      return (
        <RestClient
          propMethod={params.request[0]}
          propUrl={params.request[1]}
          propBody={params.request[2]}
        />
      );
    } else if (params.request[0] === 'GRAPHIQL') {
      return <div>GRAPHIQL client</div>;
    } else notFound();
  } else notFound();
};

export default ClientPage;
