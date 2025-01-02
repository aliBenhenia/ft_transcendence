
const picUrl = 'https://starryai.com/cdn-cgi/image/format=avif,quality=90/https://cdn.prod.website-files.com/61554cf069663530fc823d21/6369fecfca0b103aeee62f8c_download-15-min.png';
const picUrl2 = 'https://starryai.com/cdn-cgi/image/format=avif,quality=90/https://cdn.prod.website-files.com/61554cf069663530fc823d21/6369feceabcbabf851ebbc64_download-63-min.png';
const LastMatch = () => {
     
    return (
        <div className="flex text-white text-center gap-8 font-mono justify-center items-center">
           <div>
                <img src={picUrl} alt="Avatar" className="w-20 h-20 rounded-full border-8 border-white" />
                <p className="mt-2 font-bold">Ali</p>
           </div>
           <div>
                {/* <img src={picUrl} alt="Avatar" className="w-20 h-20 rounded-full border-8 border-white" />
                <p className="mt-2 font-bold">Ali</p> */}
                <h5 className="mt-2 font-bold ">
                    1-0
                </h5>
           </div>
           <div>
                <img src={picUrl2} alt="Avatar" className="w-20 h-20 rounded-full border-8 border-white" />
                <p className="mt-2 font-bold">julia</p>
           </div>
        </div>
    );
}
export default LastMatch;