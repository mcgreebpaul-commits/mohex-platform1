import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * This page serves as the entry point for the /admin route.
 * It checks for an authentication token and redirects the user accordingly.
 * It does not display any content itself, only a loading message during the redirect.
 */
const AdminIndexPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Check for the admin token in local storage.
        // In a real application, you might use an Auth Context for a more robust check.
        const token = localStorage.getItem('token');

        if (token) {
            // If a token exists, assume the admin is logged in and redirect to the dashboard.
            router.push('/admin/dashboard');
        } else {
            // If no token exists, redirect to the login page.
            router.push('/admin/login');
        }
    }, [router]); // The effect depends on the router being available.

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <p className="text-xl">Loading...</p>
        </div>
    );
};

export default AdminIndexPage;