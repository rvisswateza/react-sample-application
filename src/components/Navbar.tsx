import { Button } from "primereact/button";
import { useState } from "react"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <div className='navbar bg-primary-900 flex p-1 justify-content-center align-items-center'>
            <div className="container-width flex justify-content-between align-items-start flex-column md:flex-row md:align-items-center">
                <div className="flex">
                    <Button
                        className={`mx-1 text-white md:hidden`}
                        icon={`pi ${isMenuOpen ? "pi-times" : "pi-bars"}`}
                        text
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                    />
                    <div className='text-3xl p-2 text-white white-space-nowrap'>Numerology Calculator</div>
                </div>
                <div className={`align-items-center h-full hidden md:flex md:flex-row md:w-min ${isMenuOpen ? "flex w-full flex-column py-4" : ""}`}>
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