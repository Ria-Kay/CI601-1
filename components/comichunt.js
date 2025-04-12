import Link from 'next/link';

const Comichunt = () => {
    return (
        <div className="logoContainer">
            {/* Link to home page when logo is clicked */}
            <Link href="/">
                    <img
                        src="/images/updatedlogo.svg" // Rename the logo??
                        alt="Comic Hunt Logo"
                    />
            </Link>
        </div>
    );
};

export default Comichunt;
