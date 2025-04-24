export const formatCurrency = (value: number) => {
    return value?.toLocaleString('es-AR', {
      style: 'decimal',
      minimumFractionDigits: 2
    })
  }