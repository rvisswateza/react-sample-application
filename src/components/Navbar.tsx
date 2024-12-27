const Navbar = () => {
    return (
        <div className='navbar bg-primary-900 flex p-1 justify-content-center align-items-center'>
            <div className="container-width flex justify-content-between align-items-center">
                <div className='text-3xl p-2 text-white white-space-nowrap'>Numerology Calculator</div>
                <div className="flex align-items-center h-full">
                    <a
                        className="mx-1 p-2 h-full cursor-pointer text-white no-underline hover:underline"
                        href="/calculator"
                    >Calculator</a>
                    <a
                        className="mx-1 p-2 h-full cursor-pointer text-white no-underline hover:underline"
                        href="/names"
                    >Names</a>
                </div>
            </div>
        </div>
    )
}

export default Navbar