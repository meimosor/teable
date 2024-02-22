import type { IHttpError } from '@teable/core';
import type { ShareViewGetVo } from '@teable/openapi';
import type { GetServerSideProps } from 'next';
import { ssrApi } from '@/backend/api/rest/table.ssr';
import type { IShareViewPageProps } from '@/features/app/blocks/share/view/ShareViewPage';
import { ShareViewPage } from '@/features/app/blocks/share/view/ShareViewPage';
import { shareConfig } from '@/features/i18n/share.config';
import { getTranslationsProps } from '@/lib/i18n';

export const getServerSideProps: GetServerSideProps<IShareViewPageProps> = async (context) => {
  const { res, req, query } = context;
  const { shareId } = query;
  const { i18nNamespaces } = shareConfig;

  try {
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' *;");
    ssrApi.axios.defaults.headers['cookie'] = req.headers.cookie || '';
    const shareViewData = await ssrApi.getShareView(shareId as string);
    return {
      props: {
        shareViewData,
        ...(await getTranslationsProps(context, i18nNamespaces)),
      },
    };
  } catch (e) {
    const error = e as IHttpError;
    if (error.status === 401) {
      return {
        redirect: {
          destination: `/share/${shareId}/view/auth`,
          permanent: false,
        },
      };
    }
    return {
      err: error,
      notFound: true,
    };
  }
};

export default function ShareView({ shareViewData }: { shareViewData: ShareViewGetVo }) {
  return <ShareViewPage shareViewData={shareViewData} />;
}
