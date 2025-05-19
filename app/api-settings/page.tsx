import { ApiKeySetup } from "@/components/api-key-setup"

export default function ApiSettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">API Settings</h1>
      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          Configure your OpenAI API key to enable enhanced AI capabilities in the application. Without an API key, the
          application will use mock responses.
        </p>

        <h2 className="text-xl font-semibold mb-4">Security Guidelines</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
          <li>Never share your API key publicly or commit it to version control</li>
          <li>Set up proper API key rotation and monitoring</li>
          <li>Consider using environment variables in your deployment platform</li>
          <li>Monitor your API usage to manage costs</li>
        </ul>
      </div>

      <ApiKeySetup />
    </div>
  )
}
