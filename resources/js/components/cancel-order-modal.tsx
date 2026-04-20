import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const reasonOptions = [
    { value: 'changed-mind', label: 'Changed my mind' },
    { value: 'found-cheaper', label: 'Found cheaper elsewhere' },
    { value: 'no-longer-needed', label: 'No longer needed' },
    { value: 'wrong-item', label: 'Wrong item ordered' },
    { value: 'other', label: 'Other reason' },
];

type CancelOrderModalProps = {
    orderId: number;
    isOpen: boolean;
    onClose: () => void;
};

export default function CancelOrderModal({
    orderId,
    isOpen,
    onClose,
}: CancelOrderModalProps) {
    const [selectedReason, setSelectedReason] = useState('');
    const [detailsText, setDetailsText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!selectedReason) {
            setError('Please select a reason for cancellation');
            return;
        }

        setIsSubmitting(true);

        router.post(
            `/customer/orders/${orderId}/cancel`,
            {
                reason_category: selectedReason,
                reason: detailsText || null,
            },
            {
                onSuccess: () => {
                    setSelectedReason('');
                    setDetailsText('');
                    onClose();
                    // Refresh the page through Inertia to get updated order data
                    router.visit(window.location.pathname);
                },
                onError: (errors) => {
                    const message = errors['message'] || 'An error occurred while cancelling the order.';
                    setError(message);
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Cancel Order</DialogTitle>
                    <DialogDescription>
                        Please provide a reason for cancelling this order.
                        Your feedback helps us improve our service.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Reason Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Reason for cancellation *
                        </label>
                        <Select
                            value={selectedReason}
                            onValueChange={setSelectedReason}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {reasonOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Details Textarea */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Additional details (optional)
                        </label>
                        <Textarea
                            placeholder="Tell us more about why you're cancelling..."
                            value={detailsText}
                            onChange={(e) => setDetailsText(e.target.value)}
                            className="min-h-32"
                            maxLength={1000}
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground">
                            {detailsText.length}/1000
                        </p>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Keep Order
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={
                                isSubmitting || !selectedReason
                            }
                        >
                            {isSubmitting ? 'Cancelling...' : 'Cancel Order'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
