import { useUIText } from '../../../../shared/i18n/use-ui-text.js';
import React from 'react';
import Button from '../../../../shared/components/ui/button';

export const ApproveRejectButtons = ({
  onApprove = () => {},
  onReject = () => {},
  busy = false,
}) => {
  const ui = useUIText();
  return (
    <div className="inline-flex items-center gap-2">
      <Button variant="success" size="sm" onClick={onApprove} disabled={busy}>{ui("✓ Aprobar")}</Button>
      <Button variant="danger" size="sm" onClick={onReject} disabled={busy}>{ui("Rechazar")}</Button>
    </div>
  );
};

export default ApproveRejectButtons;
