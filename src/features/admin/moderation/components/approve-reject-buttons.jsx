import React from 'react';
import Button from '../../../../shared/components/ui/button';

export const ApproveRejectButtons = ({
  onApprove = () => {},
  onReject = () => {},
  busy = false,
}) => {
  return (
    <div className="inline-flex items-center gap-2">
      <Button variant="success" size="sm" onClick={onApprove} disabled={busy}>
        ✓ Aprobar
      </Button>
      <Button variant="danger" size="sm" onClick={onReject} disabled={busy}>
        Rechazar
      </Button>
    </div>
  );
};

export default ApproveRejectButtons;
