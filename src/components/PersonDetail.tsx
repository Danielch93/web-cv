'use client';

import type { SheetRow, UrlInfo } from '@/lib/sheets/types';
import { parseUrlInfos } from '@/lib/sheets/parser';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from './I18nProvider';
import { t } from '@/lib/i18n';
import {
  FaLinkedin,
  FaGithub,
  FaGitlab,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMedium,
  FaStackOverflow,
  FaCodepen,
  FaGlobe,
  FaBriefcase,
} from 'react-icons/fa';

/**
 * Maps domains to their corresponding icons.
 */
function getIconForDomain(domain: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    'linkedin.com': <FaLinkedin className="h-4 w-4" />,
    'upwork.com': <FaBriefcase className="h-4 w-4" />,
    'fiverr.com': <FaBriefcase className="h-4 w-4" />,
    'github.com': <FaGithub className="h-4 w-4" />,
    'gitlab.com': <FaGitlab className="h-4 w-4" />,
    'twitter.com': <FaTwitter className="h-4 w-4" />,
    'x.com': <FaTwitter className="h-4 w-4" />,
    'instagram.com': <FaInstagram className="h-4 w-4" />,
    'youtube.com': <FaYoutube className="h-4 w-4" />,
    'medium.com': <FaMedium className="h-4 w-4" />,
    'dev.to': <FaMedium className="h-4 w-4" />,
    'stackoverflow.com': <FaStackOverflow className="h-4 w-4" />,
    'codepen.io': <FaCodepen className="h-4 w-4" />,
  };

  return iconMap[domain] || <FaGlobe className="h-4 w-4" />;
}

/**
 * Link button component with icon.
 */
function LinkButton({ info }: { info: UrlInfo }) {
  return (
    <a
      href={info.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
    >
      {getIconForDomain(info.domain)}
      {info.name}
    </a>
  );
}

/**
 * Individual Project card in detail view.
 */
function ProjectDetailCard({ project }: { project: SheetRow }) {
  const urlInfos = parseUrlInfos(project.urls);

  return (
    <article className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
      {/* Title and color indicator */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className="h-4 w-4 rounded-full"
          style={{ backgroundColor: project.color }}
        />
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {project.title}
        </h3>
      </div>

      {/* Links section - first */}
      {urlInfos.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {urlInfos.map((info, index) => (
            <LinkButton key={index} info={info} />
          ))}
        </div>
      )}

      {/* Description with markdown - last */}
      {project.description && (
        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
          <ReactMarkdown>{project.description}</ReactMarkdown>
        </div>
      )}

      {/* Metadata if exists */}
      {project.metadata && (
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
          {project.metadata}
        </p>
      )}
    </article>
  );
}

/**
 * PersonDetail - Displays a person's complete profile with all projects.
 */
interface PersonDetailProps {
  /** Person's name for section title */
  personName: string;
  /** All projects/rows for this person */
  projects: SheetRow[];
}

export function PersonDetail({ personName, projects }: PersonDetailProps) {
  const { language } = useLanguage();
  const translations = t(language);
  const hasProjects = projects && projects.length > 0;

  return (
    <section>
      <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {personName}&apos;s {translations.experience}
      </h2>

      {hasProjects ? (
        <div>
          {projects.map((project, index) => (
            <ProjectDetailCard key={index} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
          <p>{translations.noDataAvailable}</p>
        </div>
      )}
    </section>
  );
}