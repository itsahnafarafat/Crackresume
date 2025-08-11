import { Header } from "@/components/shared/header";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Privacy Policy</h1>
            <p className="mt-6 text-xl text-gray-600">
              Your privacy is important to us. It is SkillSync&apos;s policy to respect your privacy regarding any information we may collect from you across our website.
            </p>
            <div className="mt-10 prose prose-lg text-gray-500">
              <h2 className="text-2xl font-bold">1. Information we collect</h2>
              <p>
                We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
              </p>
              <h2 className="text-2xl font-bold mt-8">2. How we use your information</h2>
              <p>
                We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
              </p>
              <h2 className="text-2xl font-bold mt-8">3. Local Storage</h2>
                <p>
                    Our Job Tracker feature uses your browser&apos;s local storage to save your job application data. This data is stored directly on your device and is not transmitted to our servers. You have full control over this data and can clear it at any time through your browser settings.
                </p>
              <h2 className="text-2xl font-bold mt-8">4. Links to other sites</h2>
              <p>
                Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
              </p>

              <p className="mt-8">This policy is effective as of {new Date().toLocaleDateString()}.</p>
            </div>
          </div>
        </div>
      </main>
       <footer className="flex items-center justify-center py-6 md:py-8 w-full border-t">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} SkillSync. All rights reserved.</p>
      </footer>
    </div>
  );
}
