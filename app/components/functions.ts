export function formatPost(post: any){
    const date=new Date(post.createdAt).toString().slice(4,15);
    const edited=new Date(post.updatedAt).toString().slice(4,15) + " at " +new Date(post.updatedAt).toString().slice(16,21) ;
    const hour=new Date(post.createdAt).toString().slice(16,21);
    const realDate= date+" at " +hour;
    let author=post.postedBy?.username;
    console.log(author);
    if (!author){
        author="a deleted user";
      }
    const format={
        realDate,
        author,
        edited,
    }
    return format;
}
