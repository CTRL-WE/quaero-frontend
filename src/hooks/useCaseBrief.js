import { useState, useEffect } from 'react';
import { getBrief } from '../services/caseService';

// ---------------------------------------------------------------------------
// useCaseBrief — shared hook for fetching a case's brief data.
//
// Extracted so that both BriefPage and the Investigation Workspace's
// ReferencePostStrip can consume the same brief without duplicating
// the fetch logic or the service import.
// ---------------------------------------------------------------------------

/**
 * @param {string|number|null} caseId
 * @returns {{
 *   brief:    object | null,
 *   loading:  boolean,
 *   notFound: boolean,
 * }}
 */
const useCaseBrief = (caseId) => {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (caseId === null || caseId === undefined) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getBrief(caseId);
        if (!cancelled) setBrief(data);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [caseId]);

  return { brief, loading, notFound };
};

export default useCaseBrief;
