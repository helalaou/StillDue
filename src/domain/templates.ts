import type { Template } from './types';
const base = {
  version: 1,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  isSystem: true,
};
export const systemTemplates: Template[] = [
  {
    ...base,
    id: 'paper',
    name: 'Conference paper',
    description: 'From first draft to a submission you can stand behind.',
    kind: 'Research',
    steps: [
      {
        title: 'First complete draft',
        daysBefore: 21,
        nextAction: 'Outline the argument and section headings.',
      },
      {
        title: 'Coauthor review',
        daysBefore: 10,
        nextAction: 'Share a readable draft with your coauthors.',
      },
      {
        title: 'Abstract registration',
        daysBefore: 7,
        nextAction: 'Check the official abstract deadline.',
      },
      {
        title: 'Full paper submission',
        daysBefore: 0,
        nextAction: 'Review the submission checklist.',
      },
    ],
  },
  {
    ...base,
    id: 'workshop',
    name: 'Workshop proposal',
    description: 'Shape the idea, bring people together, and send it in.',
    kind: 'Research',
    steps: [
      {
        title: 'Confirm organizers',
        daysBefore: 21,
        nextAction: 'Invite the people you want to work with.',
      },
      {
        title: 'Proposal draft',
        daysBefore: 10,
        nextAction: 'Describe the audience and the workshop format.',
      },
      {
        title: 'Workshop proposal',
        daysBefore: 0,
        nextAction: 'Check formatting and upload the proposal.',
      },
    ],
  },
  {
    ...base,
    id: 'poster',
    name: 'Poster or demo',
    description: 'A small format with room for a big idea.',
    kind: 'Research',
    steps: [
      {
        title: 'Choose the story',
        daysBefore: 14,
        nextAction: 'Write the one sentence people should remember.',
      },
      {
        title: 'Poster or demo submission',
        daysBefore: 0,
        nextAction: 'Check all required materials.',
      },
    ],
  },
  {
    ...base,
    id: 'grant',
    name: 'Grant application',
    description: 'Make space for the budget, the feedback, and the final pass.',
    kind: 'Application',
    steps: [
      {
        title: 'Budget and scope',
        daysBefore: 30,
        nextAction: 'List the work and resources needed.',
      },
      { title: 'Internal review', daysBefore: 14, nextAction: 'Send the narrative to a reviewer.' },
      {
        title: 'Grant submission',
        daysBefore: 0,
        nextAction: 'Check the funding call requirements.',
      },
    ],
  },
  {
    ...base,
    id: 'thesis',
    name: 'Thesis milestone',
    description: 'Make the next substantial piece feel manageable.',
    kind: 'Research',
    steps: [
      { title: 'Chapter outline', daysBefore: 28, nextAction: 'Decide the chapter’s main claim.' },
      {
        title: 'Advisor review',
        daysBefore: 14,
        nextAction: 'Send a draft and specific questions.',
      },
      { title: 'Thesis milestone', daysBefore: 0, nextAction: 'Finish the final revision.' },
    ],
  },
  {
    ...base,
    id: 'course',
    name: 'Coursework',
    description: 'A little structure between the assignment and the finish.',
    kind: 'Coursework',
    steps: [
      {
        title: 'First working draft',
        daysBefore: 5,
        nextAction: 'Read the assignment and identify the first step.',
      },
      {
        title: 'Assignment submission',
        daysBefore: 0,
        nextAction: 'Review the rubric and submit.',
      },
    ],
  },
  {
    ...base,
    id: 'application',
    name: 'Fellowship or job',
    description: 'Keep the letters and little details from becoming a rush.',
    kind: 'Application',
    steps: [
      {
        title: 'Request recommendations',
        daysBefore: 28,
        nextAction: 'Ask recommenders and share the deadline.',
      },
      { title: 'Review materials', daysBefore: 7, nextAction: 'Proofread your statement and CV.' },
      { title: 'Application submission', daysBefore: 0, nextAction: 'Review required documents.' },
    ],
  },
  {
    ...base,
    id: 'general',
    name: 'A simple deadline',
    description: 'A title, a date, and your next small step.',
    kind: 'Deadline',
    steps: [{ title: 'My deadline', daysBefore: 0, nextAction: '' }],
  },
];
