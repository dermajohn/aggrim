import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse/movie" className="text-gray-400 hover:text-white transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/browse/tv" className="text-gray-400 hover:text-white transition-colors">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/browse/anime" className="text-gray-400 hover:text-white transition-colors">
                  Anime
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Genres</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse/movie?genre=28" className="text-gray-400 hover:text-white transition-colors">
                  Action
                </Link>
              </li>
              <li>
                <Link href="/browse/movie?genre=35" className="text-gray-400 hover:text-white transition-colors">
                  Comedy
                </Link>
              </li>
              <li>
                <Link href="/browse/movie?genre=18" className="text-gray-400 hover:text-white transition-colors">
                  Drama
                </Link>
              </li>
              <li>
                <Link href="/browse/movie?genre=27" className="text-gray-400 hover:text-white transition-colors">
                  Horror
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Streaming</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Netflix</li>
              <li className="text-gray-400">Disney+</li>
              <li className="text-gray-400">Amazon Prime</li>
              <li className="text-gray-400">Max</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Powered by TMDB</li>
              <li className="text-gray-400">API Attribution</li>
              <li className="text-gray-400">Privacy Policy</li>
              <li className="text-gray-400">Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 Aggrim. All rights reserved. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
