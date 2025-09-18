'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Copy, ExternalLink } from 'lucide-react';

export default function TokenHelperPage() {
  const router = useRouter();
  const [consoleOutput, setConsoleOutput] = useState('');
  const [extractedTokens, setExtractedTokens] = useState<{
    activation?: { token: string; url: string };
    reset?: { id: string; token: string; url: string };
  }>({});

  const extractTokens = () => {
    // Extract activation token and URL
    const activationMatch = consoleOutput.match(/activation link\s+([^\s]+)/i);
    if (activationMatch) {
      const url = activationMatch[1];
      const tokenMatch = url.match(/\/activate\/([^\/\s]+)/);
      if (tokenMatch) {
        setExtractedTokens(prev => ({
          ...prev,
          activation: {
            token: tokenMatch[1],
            url: url
          }
        }));
      }
    }

    // Extract password reset token and URL
    const resetMatch = consoleOutput.match(/reset link\s+([^\s]+)/i);
    if (resetMatch) {
      const url = resetMatch[1];
      const urlMatch = url.match(/\/reset-password\/([^\/]+)\/([^\/\s]+)/);
      if (urlMatch) {
        setExtractedTokens(prev => ({
          ...prev,
          reset: {
            id: urlMatch[1],
            token: urlMatch[2],
            url: url
          }
        }));
      }
    }

    if (!activationMatch && !resetMatch) {
      alert('No tokens found. Make sure to paste the full console output including "activation link" or "reset link"');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const navigateToActivation = (token: string) => {
    router.push(`/activate/${token}`);
  };

  const navigateToReset = (id: string, token: string) => {
    router.push(`/reset-password/${id}/${token}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full">
              <Leaf className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
            Token Extraction Helper
          </h1>
          <p className="text-green-600">Extract activation and reset tokens from backend console output</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 border border-green-100">
          <div className="mb-6">
            <label htmlFor="console" className="block text-sm font-medium text-green-700 mb-2">
              Paste Backend Console Output:
            </label>
            <textarea
              id="console"
              value={consoleOutput}
              onChange={(e) => setConsoleOutput(e.target.value)}
              placeholder="Paste the console output here that contains:
- 'this is activation link http://localhost:3000/activate/...'
- 'this is email reset link http://localhost:3000/reset-password/...'"
              className="w-full h-40 px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
            />
          </div>

          <button
            onClick={extractTokens}
            className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 font-medium transition-all transform hover:scale-105 shadow-lg mb-6"
          >
            Extract Tokens
          </button>

          {/* Extracted Activation Token */}
          {extractedTokens.activation && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                ✅ Activation Token Found
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Token:</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={extractedTokens.activation.token}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(extractedTokens.activation!.token)}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      title="Copy token"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Full URL:</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={extractedTokens.activation.url}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded font-mono text-xs"
                    />
                    <button
                      onClick={() => copyToClipboard(extractedTokens.activation!.url)}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => navigateToActivation(extractedTokens.activation!.token)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Go to Activation Page
                </button>
              </div>
            </div>
          )}

          {/* Extracted Reset Token */}
          {extractedTokens.reset && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                🔑 Password Reset Token Found
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">User ID:</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={extractedTokens.reset.id}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-orange-200 rounded font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(extractedTokens.reset!.id)}
                      className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                      title="Copy ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Reset Token:</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={extractedTokens.reset.token}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-orange-200 rounded font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(extractedTokens.reset!.token)}
                      className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                      title="Copy token"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Full URL:</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={extractedTokens.reset.url}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-orange-200 rounded font-mono text-xs"
                    />
                    <button
                      onClick={() => copyToClipboard(extractedTokens.reset!.url)}
                      className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => navigateToReset(extractedTokens.reset!.id, extractedTokens.reset!.token)}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Go to Password Reset Page
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">How to use:</h3>
          <ol className="list-decimal list-inside text-sm space-y-1 text-gray-700">
            <li>Register a new user or request password reset</li>
            <li>Check your backend console for output like:
              <code className="block mt-1 mb-1 bg-white px-2 py-1 rounded text-xs">
                this is activation link http://localhost:3000/activate/eyJhbG...
              </code>
            </li>
            <li>Copy the entire console output and paste it above</li>
            <li>Click {'"Extract Tokens"'} to parse the tokens</li>
            <li>Click the button to navigate to the activation/reset page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}