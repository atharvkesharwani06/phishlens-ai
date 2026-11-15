import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  MessageSquare, 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  Search, 
  AlertCircle, 
  Lock, 
  Plus, 
  Trash2,
  FileCode
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

      setTimeout(() => {
        if (result?.id) {
          navigate(`/result/${result.id}`);
        }
      }, 1400);
    } catch (err: any) {
      console.error('Analysis execution failed:', err);
      setErrorMessage(err.response?.data?.detail || err.message || 'Analysis failed. Please check inputs.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 font-sans animate-page-enter">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#172321] tracking-tight font-sans">
          Threat Analysis Console
        </h1>
        <p className="text-xs sm:text-sm text-[#697773] mt-1 max-w-xl mx-auto">
          Submit suspicious messages, URLs, email content, or screenshots for explainable forensic analysis.
        </p>
      </div>

      {isLoading ? (
        <AnalysisLoader inputType={activeTab} />
      ) : (
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E8E5] shadow-xs overflow-hidden">
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#E2E8E5] bg-[#F7F8F6] p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => handleTabChange('text')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-sans font-medium transition-colors cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-[#FFFFFF] text-[#087F75] border border-[#087F75]/20 font-semibold shadow-xs'
                  : 'text-[#697773] hover:text-[#172321] hover:bg-[#FFFFFF]/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('url')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-sans font-medium transition-colors cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-[#FFFFFF] text-[#087F75] border border-[#087F75]/20 font-semibold shadow-xs'
                  : 'text-[#697773] hover:text-[#172321] hover:bg-[#FFFFFF]/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>URL Link</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('email')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-sans font-medium transition-colors cursor-pointer ${
                activeTab === 'email'
                  ? 'bg-[#FFFFFF] text-[#087F75] border border-[#087F75]/20 font-semibold shadow-xs'
                  : 'text-[#697773] hover:text-[#172321] hover:bg-[#FFFFFF]/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('screenshot')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-sans font-medium transition-colors cursor-pointer ${
                activeTab === 'screenshot'
                  ? 'bg-[#FFFFFF] text-[#087F75] border border-[#087F75]/20 font-semibold shadow-xs'
                  : 'text-[#697773] hover:text-[#172321] hover:bg-[#FFFFFF]/60'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Screenshot</span>
            </button>
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-7 space-y-5">
            {/* TAB 1: MESSAGE */}
            {activeTab === 'text' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-sans text-[#172321] font-semibold">
                    Suspicious Message Text
                  </label>
                  <button
                    type="button"
                    onClick={loadMessageDemo}
                    className="text-xs font-sans text-[#087F75] hover:text-[#076c64] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Load Sample Payload</span>
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={5}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Paste a suspicious SMS, WhatsApp message, email excerpt, or direct message here..."
                    className="w-full rounded-lg bg-[#FFFFFF] border border-[#E2E8E5] p-3.5 text-xs font-mono text-[#172321] placeholder-[#697773]/60 focus:outline-none focus:border-[#087F75] focus:ring-1 focus:ring-[#087F75] transition-colors leading-relaxed shadow-xs"
                  />
                  <div className="absolute bottom-2.5 right-3 text-[11px] font-mono text-[#697773]">
                    {messageText.length} chars
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: URL */}
            {activeTab === 'url' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-sans text-[#172321] font-semibold">
                    Target Suspicious URL
                  </label>
                  <button
                    type="button"
                    onClick={loadUrlDemo}
                    className="text-xs font-sans text-[#087F75] hover:text-[#076c64] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Load Sample URL</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://secure-login.suspicious-domain.xyz/auth or domain name"
                  className="w-full rounded-lg bg-[#FFFFFF] border border-[#E2E8E5] px-3.5 py-2.5 text-xs font-mono text-[#172321] placeholder-[#697773]/60 focus:outline-none focus:border-[#087F75] focus:ring-1 focus:ring-[#087F75] transition-colors shadow-xs"
                />

                <div className="p-3 rounded-lg bg-[#E6F4F1]/50 border border-[#087F75]/20 text-xs text-[#172321] flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-[#087F75] shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-[#172321] font-sans">Static Inspection Protocol:</strong> PhishLens evaluates target URL lexical structure, entropy, and domain ownership offline. Targets are strictly parsed and never automatically visited or executed.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: EMAIL */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-[#172321] font-semibold">
                    Email Headers &amp; Body
                  </span>
                  <button
                    type="button"
                    onClick={loadEmailDemo}
                    className="text-xs font-sans text-[#087F75] hover:text-[#076c64] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Load Sample Email</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-sans text-[#697773] block mb-1">Display Sender Name</label>
                    <input
                      type="text"
                      value={emailSenderName}
                      onChange={(e) => setEmailSenderName(e.target.value)}
                      placeholder="e.g. Bank Security Department"
                      className="w-full rounded-lg bg-[#FFFFFF] border border-[#E2E8E5] px-3 py-2 text-xs font-sans text-[#172321] placeholder-[#697773]/60 focus:outline-none focus:border-[#087F75] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-sans text-[#697773] block mb-1">Sender Email Address</label>
                    <input
                      type="text"
                      value={emailSenderEmail}
                      onChange={(e) => setEmailSenderEmail(e.target.value)}
                      placeholder="e.g. alerts@bank-security-notification.xyz"
                      className="w-full rounded-lg bg-[#FFFFFF] border border-[#E2E8E5] px-3 py-2 text-xs font-mono text-[#172321] placeholder-[#697773]/60 focus:outline-none focus:border-[#087F75] shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-sans text-[#697773] block mb-1">Subject Header</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g. Action Required: Account Suspension Warning"
                    className="w-full rounded-lg bg-[#FFFFFF] border border-[#E2E8E5] px-3 py-2 text-xs font-sans text-[#172321] placeholder-[#697773]/60 focus:outline-none focus:border-[#087F75] shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-sans text-[#697773] block mb-1">Email Body Text</label>
                  <textarea
                    rows={4}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Paste full email body contents here..."
                    className="w-full rounded-lg bg-[#FFFFFF] border border-[#E2E8E5] p-3 text-xs font-mono text-[#172321] placeholder-[#697773]/60 focus:outline-none focus:border-[#087F75] shadow-xs"
                  />
                </div>

                {/* Optional Links in Email */}
                <div>
                  <label className="text-[11px] font-sans text-[#697773] block mb-1">Embedded Hyperlinks (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLinkInput}
                      onChange={(e) => setNewLinkInput(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 rounded-lg bg-[#FFFFFF] border border-[#E2E8E5] px-3 py-2 text-xs font-mono text-[#172321] placeholder-[#697773]/60 focus:outline-none focus:border-[#087F75] shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="px-3 py-2 bg-[#F7F8F6] hover:bg-[#E2E8E5] text-[#172321] rounded-lg text-xs font-sans font-medium flex items-center gap-1 border border-[#E2E8E5] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {emailLinks.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {emailLinks.map((link, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-mono bg-[#F7F8F6] px-3 py-1.5 rounded border border-[#E2E8E5] text-[#172321]">
                          <span className="truncate">{link}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveLink(idx)} 
                            className="text-[#697773] hover:text-[#C74747] ml-2 cursor-pointer"
                            aria-label="Remove link"
                          >
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
              <div className="flex items-center gap-2 p-3.5 rounded-lg bg-[#C74747]/8 border border-[#C74747]/25 text-[#C74747] text-xs font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#C74747]" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Submit Button */}
            <div className="pt-4 border-t border-[#E2E8E5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-sans text-[#697773]">
                Evaluation: Linguistic NLP + Static URL Heuristics + OCR Extraction
              </span>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#087F75] hover:bg-[#076c64] active:scale-[0.98] text-white font-sans font-semibold text-xs shadow-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Search className="w-3.5 h-3.5 text-white" />
                <span>
                  {activeTab === 'text' && 'Analyze Message'}
                  {activeTab === 'url' && 'Analyze URL'}
                  {activeTab === 'email' && 'Analyze Email'}
                  {activeTab === 'screenshot' && 'Extract Text & Analyze'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
