import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  className?: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && closeOnEscape) {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, closeOnEscape])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose()
    }
  }

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-7xl mx-4'
  }

  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 z-[var(--z-index-modal)] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-label="Modal backdrop"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full rounded-2xl bg-white shadow-xl focus:outline-none max-h-[90vh] overflow-hidden',
          'transform transition-all duration-200 ease-out',
          sizes[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-[rgb(var(--color-border-primary))]">
            <div>
              {title && (
                <h2 id="modal-title" className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-border-focus))]"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5 text-[rgb(var(--color-text-secondary))]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export interface ModalHeaderProps {
  title?: string
  description?: string
  onClose?: () => void
  className?: string
  children?: React.ReactNode
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  description,
  onClose,
  className,
  children
}) => {
  return (
    <div className={cn('flex items-center justify-between p-6 border-b border-[rgb(var(--color-border-primary))]', className)}>
      <div>
        {title && (
          <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            {description}
          </p>
        )}
        {children}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-border-focus))]"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5 text-[rgb(var(--color-text-secondary))]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export interface ModalBodyProps {
  className?: string
  children: React.ReactNode
}

export const ModalBody: React.FC<ModalBodyProps> = ({ className, children }) => {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  )
}

export interface ModalFooterProps {
  className?: string
  children: React.ReactNode
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ className, children }) => {
  return (
    <div className={cn('flex items-center justify-end gap-3 p-6 border-t border-[rgb(var(--color-border-primary))]', className)}>
      {children}
    </div>
  )
}

export { Modal }
export default Modal