const Navbar = () => {
    return (
        <div className='w-full bg-primary-900 p-1 flex justify-content-between align-items-center'>
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
    )
}

export default Navbar