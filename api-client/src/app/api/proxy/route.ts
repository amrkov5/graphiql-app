// import { NextRequest, NextResponse } from 'next/server';

// export async function handler(req: NextRequest) {
//   try {
//     const { method, url, headers, body } = await req.json();

//     if (!url) {
//       return NextResponse.json({ error: 'URL is required' }, { status: 400 });
//     }

//     const response = await fetch(url, {
//       method,
//       headers,
//       body: method !== 'GET' ? JSON.stringify(body) : undefined,
//     });

//     const data = await response.json();

//     return NextResponse.json(data, { status: response.status });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch data', message: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }

// export {
//   handler as GET,
//   handler as POST,
//   handler as PUT,
//   handler as DELETE,
//   handler as PATCH,
//   handler as HEAD,
//   handler as OPTIONS,
// };

// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   console.log('Request received:', req.body); // Логируем тело запроса

//   try {
//     const { method, fullUrl, headers, body } = req.body;

//     if (!fullUrl) {
//       console.error('URL is missing in the request body');
//       return res.status(400).json({ error: 'URL is required' });
//     }

//     const response = await fetch(fullUrl, {
//       method,
//       headers,
//       body: method !== 'GET' ? JSON.stringify(body) : undefined,
//     });

//     if (!response.ok) {
//       console.error('Failed to fetch from URL:', response.statusText);
//       return res
//         .status(response.status)
//         .json({ error: 'Failed to fetch from URL' });
//     }

//     const data = await response.json();
//     res.status(response.status).json(data);
//   } catch (error) {
//     console.error('Error in API handler:', error);
//     res.status(500).json({
//       error: 'Failed to fetch data',
//       message: (error as Error).message,
//     });
//   }
// }

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Request received:', req.body);

  switch (req.method) {
    case 'POST':
    case 'GET':
    case 'PUT':
    case 'DELETE':
    case 'PATCH':
    case 'HEAD':
    case 'OPTIONS':
      // Обрабатываем запрос для всех поддерживаемых методов
      res.status(200).json(req.body);
      break;
    default:
      // Обрабатываем запросы для не поддерживаемых методов
      res.setHeader('Allow', [
        'POST',
        'GET',
        'PUT',
        'DELETE',
        'PATCH',
        'HEAD',
        'OPTIONS',
      ]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}

// Экспортируем обработчик для всех методов
export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
  handler as HEAD,
  handler as OPTIONS,
};
