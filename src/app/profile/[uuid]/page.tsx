import { DefaultLayout } from '@/app/widgets/layout'

const PostPage = async ({ params }: { params: Promise<{ uuid: string }> }) => {
    const { uuid } = await params
    return (
        <DefaultLayout>
            <div>Здесь пост с ID: {uuid}</div>
        </DefaultLayout>
    )
}

export default PostPage
