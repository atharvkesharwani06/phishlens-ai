import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  MessageSquare, 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  Search, 
  Sparkles, 
  AlertCircle, 
  Lock, 
  Plus, 
  Trash2, 
  Zap 
} from 'lucide-react';
import { AnalysisService } from '../services/api';
import { AnalysisLoader } from '../components/AnalysisLoader';
import { UploadZone } from '../components/UploadZone';

export const AnalyzePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Tab states: 'text' | 'url' | 'email' | 'screenshot'
  const initialTab = (searchParams.get('tab') as any) || 'text';
  const [activeTab, setActiveTab] = useState<'text' | 'url' | 'email' | 'screenshot'>(
    ['text', 'url', 'email', 'screenshot'].includes(initialTab) ? initialTab : 'text'
  );

  // Form states
  const [messageText, setMessageText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [emailSenderName, setEmailSenderName] = useState('');
  const [emailSenderEmail, setEmailSenderEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailLinks, setEmailLinks] = useState<string[]>([]);
  const [newLinkInput, setNewLinkInput] = useState('');
  
  // Screenshot file
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

  // Execution & UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update URL search params on tab change
  const handleTabChange = (tab: 'text' | 'url' | 'email' | 'screenshot') => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setErrorMessage(null);
  };

  // Demo Loaders
  const loadMessageDemo = () => {
    setMessageText(
      'URGENT: Your Chase checking account will be BLOCKED TODAY due to suspicious security activity. Verify your password immediately to avoid permanent closure: https://chase-security-verify.xyz/auth'
    );
  };

  const loadUrlDemo = () => {
    setUrlInput('http://192.168.1.100@paypal-security-verification.xyz/webapps/auth/login?session=8923');
  };

  const loadEmailDemo = () => {
    setEmailSenderName('Internal Revenue Service Support');
    setEmailSenderEmail('tax-enforcement@irs-penalty-notification.xyz');
    setEmailSubject('FINAL WARNING: Immediate Tax Audit Notice #TX-984210');
    setEmailBody(
      'LEGAL NOTICE: Our cyber crime audit team identified tax evasion penalties of $4,820 on your social security file. An arrest warrant will be filed within 24 hours. Pay your penalty immediately to avoid police action: https://irs-official-clearance.cc/settle'
    );
    setEmailLinks(['https://irs-official-clearance.cc/settle']);
  };

  // Add/Remove email link
  const handleAddLink = () => {
    if (newLinkInput.trim()) {
      setEmailLinks([...emailLinks, newLinkInput.trim()]);
      setNewLinkInput('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setEmailLinks(emailLinks.filter((_, idx) => idx !== index));
  };

  // Submission handler
  const handleAnalyze = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      let result: any;

      if (activeTab === 'text') {
        if (!messageText.trim()) {
          throw new Error('Please enter message text to analyze.');
        }
        result = await AnalysisService.analyzeText(messageText);
      } else if (activeTab === 'url') {
        if (!urlInput.trim()) {
          throw new Error('Please enter a URL to analyze.');
        }
        result = await AnalysisService.analyzeUrl(urlInput.trim());
      } else if (activeTab === 'email') {
        if (!emailBody.trim()) {
          throw new Error('Please enter email body content to analyze.');
        }
        result = await AnalysisService.analyzeEmail({
          sender_name: emailSenderName,
          sender_email: emailSenderEmail,
          subject: emailSubject,
          body: emailBody,
          links: emailLinks,
        });
      } else if (activeTab === 'screenshot') {
        if (!screenshotFile) {
          throw new Error('Please upload an image screenshot to analyze.');
        }
        result = await AnalysisService.analyzeImage(screenshotFile);
      }

      // Small delay to allow the loading animation to smoothly display
      setTimeout(() => {
        if (result?.id) {
          navigate(`/result/${result.id}`);
        }
      }, 1500);
    } catch (err: any) {
      console.error('Analysis execution failed:', err);
      setErrorMessage(err.response?.data?.detail || err.message || 'Analysis failed. Please check inputs.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white font-mono tracking-tight">
          THREAT ANALYSIS CONSOLE
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          Submit suspicious messages, URLs, emails, or screenshots for explainable AI threat verification.
        </p>
      </div>

      {isLoading ? (
        <AnalysisLoader inputType={activeTab} />
      ) : (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1.5">
            <button
              onClick={() => handleTabChange('text')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'text'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>MESSAGE</span>
            </button>

            <button
              onClick={() => handleTabChange('url')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'url'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>URL LINK</span>
            </button>

            <button
              onClick={() => handleTabChange('email')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'email'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>EMAIL</span>
            </button>

            <button
              onClick={() => handleTabChange('screenshot')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'screenshot'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>SCREENSHOT</span>
            </button>
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* TAB 1: MESSAGE */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                    Suspicious Message Content
                  </label>
                  <button
                    type="button"
                    onClick={loadMessageDemo}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load Demo Sample</span>
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={6}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Paste a suspicious SMS, WhatsApp message, email, or social media message here..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all leading-relaxed"
                  />
                  <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-500">
                    {messageText.length} characters
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: URL */}
            {activeTab === 'url' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                    Target Suspicious URL
                  </label>
                  <button
                    type="button"
                    onClick={loadUrlDemo}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load URL Demo</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://secure-bank-login.example.com/verify or domain"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3.5 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />

                <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-cyan-300 font-mono">Static Security Protocol:</strong> PhishLens evaluates URL structure, entropy, and domain ownership offline. We <span className="text-cyan-300 font-semibold">never automatically visit</span> or trigger JavaScript from submitted targets.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: EMAIL */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 font-semibold uppercase">
                    Full Email Message Fields
                  </span>
                  <button
                    type="button"
                    onClick={loadEmailDemo}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load Email Demo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Sender Name</label>
                    <input
                      type="text"
                      value={emailSenderName}
                      onChange={(e) => setEmailSenderName(e.target.value)}
                      placeholder="e.g. PayPal Security Alert"
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Sender Email Address</label>
                    <input
                      type="text"
                      value={emailSenderEmail}
                      onChange={(e) => setEmailSenderEmail(e.target.value)}
                      placeholder="e.g. support@service-notification-xyz.com"
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Subject Line</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g. Action Required: Your account will be restricted in 24 hours"
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Email Body Content</label>
                  <textarea
                    rows={4}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Paste the full email text or message contents here..."
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Optional Links in Email */}
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Embedded Links (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLinkInput}
                      onChange={(e) => setNewLinkInput(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-mono flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {emailLinks.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {emailLinks.map((link, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                          <span className="truncate">{link}</span>
                          <button onClick={() => handleRemoveLink(idx)} className="text-slate-500 hover:text-red-400 ml-2">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: SCREENSHOT */}
            {activeTab === 'screenshot' && (
              <UploadZone
                selectedFile={screenshotFile}
                onFileSelect={(file) => setScreenshotFile(file)}
                onClear={() => setScreenshotFile(null)}
                isLoading={isLoading}
              />
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Submit Button */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-slate-500">
                AI Pipeline: NLP Rules + Machine Learning + Static URL Engine
              </span>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>
                  {activeTab === 'text' && 'Analyze Message'}
                  {activeTab === 'url' && 'Analyze URL'}
                  {activeTab === 'email' && 'Analyze Email'}
                  {activeTab === 'screenshot' && 'Scan Screenshot with OCR'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
