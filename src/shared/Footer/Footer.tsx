import Link from 'next/link';
import React from 'react';
import { BsLinkedin, BsSpotify, BsTwitter } from 'react-icons/bs';
import { MdCopyright } from 'react-icons/md';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-black py-6">
      <div className="container mx-auto px-6">
        {/* Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="text-xl font-medium">Quick Links</h4>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/products">Collection</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-medium">Follow Us</h4>
            <div className="flex gap-4">
              <Link href="https://twitter.com" target="_blank">
                <BsTwitter className="text-2xl" />
              </Link>
              <Link href="https://spotify.com" target="_blank">
                <BsSpotify className="text-2xl" />
              </Link>
              <Link href="https://linkedin.com" target="_blank">
                <BsLinkedin className="text-2xl" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-medium">Subscribe</h4>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded bg-gray-700 text-black"
            />
            <button className="w-full mt-2 py-2 bg-blue-600 text-white rounded">Subscribe</button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-600 pt-4 text-center">
          <div className="flex justify-center items-center gap-2">
            <MdCopyright />
            <span>2023 LuxLoom. All rights reserved</span>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <Link href="/terms" className="text-sm">Terms of Service</Link>
            <Link href="/privacy" className="text-sm">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
