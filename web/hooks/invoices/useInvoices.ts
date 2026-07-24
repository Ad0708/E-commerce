import { useMutation } from "@tanstack/react-query";

import { downloadAdminInvoice, downloadInvoice } from "@/api/invoice";

/* -------------------------------------------------------------------------- */
/* Download Invoice Hook                                                      */
/* -------------------------------------------------------------------------- */

export const useDownloadInvoice = () => {
  return useMutation({
    mutationFn: downloadInvoice,

    onSuccess: (blob, orderId) => {
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `invoice-${orderId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });
};

export const useDownloadAdminInvoice = () => {
  return useMutation({
    mutationFn: downloadAdminInvoice,

    onSuccess: (blob, orderId) => {
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `invoice-${orderId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });
};
