export function generateAvatarUrl(name?: string, id?: string): string {
  const displayName = name || id || 'User';
  
  const initials = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const colors = [
    '007bff', // blue
    '28a745', // green
    'dc3545', // red
    'ffc107', // amber
    '17a2b8', // cyan
    '6610f2', // indigo
    'e83e8c', // pink
    '20c997', // teal
    'fd7e14', // orange
    '6f42c1', // purple
  ];
  
  const hash = (displayName || '').split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const colorIndex = Math.abs(hash) % colors.length;
  const bgColor = colors[colorIndex];
  
  const params = new URLSearchParams({
    name: initials,
    background: bgColor,
    color: 'ffffff',
    size: '400',
    font: '0.5',
    bold: 'true',
    format: 'svg',
  });
  
  return `https://ui-avatars.com/api/?${params.toString()}`;
}

export function generatePlaceholderImage(width = 400, height = 400, text = 'No Image'): string {
  return `https://via.placeholder.com/${width}x${height}/e0e0e0/666666?text=${encodeURIComponent(text)}`;
}
