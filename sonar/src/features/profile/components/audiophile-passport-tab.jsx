import { useUIText } from '../../../shared/i18n/use-ui-text.js';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../../../shared/components/ui/avatar';
import { avatarPropsFor } from '../../../shared/components/ui/avatar-props';
import { useLanguage } from '../../../shared/context/language-context';
import AudiophileMonthlyWrapped from './audiophile-monthly-wrapped';
import AudiophileQuests from './audiophile-quests';

const buildPassportPdf = (passport) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext('2d');
  const palette = {
    violet: '#1A0C1A',
    deepViolet: '#231123',
    berry: '#3A1B34',
    teal: '#003844',
    gold: '#F3B700',
    goldGlow: '#FFE28A',
    cyan: '#83D1D8',
    red: '#B80C09',
    paper: '#FDFBFC',
    cardBg: 'rgba(255, 255, 255, 0.065)',
    cardBorder: 'rgba(220, 220, 221, 0.16)',
    muted: '#C8B9C6',
    subtle: '#8C7A8A',
  };

  const roundedRect = (x, y, width, height, radius, fill, stroke, lineWidth = 2) => {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  };

  const fitText = (value, x, y, maxWidth, size, color, weight = 500) => {
    let fontSize = size;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = color;
    ctx.font = `${weight} ${fontSize}px "Segoe UI", Arial, sans-serif`;
    while (ctx.measureText(String(value)).width > maxWidth && fontSize > 11) {
      fontSize -= 1;
      ctx.font = `${weight} ${fontSize}px "Segoe UI", Arial, sans-serif`;
    }
    ctx.fillText(String(value), x, y, maxWidth);
  };

  const drawQrCode = (startX, startY, size, text) => {
    const modules = 21;
    const cellSize = size / modules;
    roundedRect(startX - 6, startY - 6, size + 12, size + 12, 10, '#FFFFFF', palette.gold, 2);
    ctx.fillStyle = '#1A0C1A';

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    const isTarget = (r, c) => {
      if (r < 7 && c < 7) return true;
      if (r < 7 && c >= modules - 7) return true;
      if (r >= modules - 7 && c < 7) return true;
      return false;
    };

    const drawFinderPattern = (pr, pc) => {
      ctx.fillStyle = '#1A0C1A';
      ctx.fillRect(startX + pc * cellSize, startY + pr * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(startX + (pc + 1) * cellSize, startY + (pr + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#1A0C1A';
      ctx.fillRect(startX + (pc + 2) * cellSize, startY + (pr + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawFinderPattern(0, 0);
    drawFinderPattern(0, modules - 7);
    drawFinderPattern(modules - 7, 0);

    ctx.fillStyle = '#1A0C1A';
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (!isTarget(r, c)) {
          const pseudo = Math.sin((r + 1) * (c + 1) * 31 + hash) * 10000;
          if (pseudo - Math.floor(pseudo) > 0.46) {
            ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize - 0.5, cellSize - 0.5);
          }
        }
      }
    }
  };

  const drawHolographicSeal = (cx, cy, r) => {
    const sealGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, r + 16);
    sealGlow.addColorStop(0, 'rgba(243, 183, 0, 0.35)');
    sealGlow.addColorStop(1, 'rgba(184, 12, 9, 0)');
    ctx.fillStyle = sealGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 16, 0, Math.PI * 2);
    ctx.fill();

    const goldGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    goldGrad.addColorStop(0, '#FFE89E');
    goldGrad.addColorStop(0.3, '#D4971A');
    goldGrad.addColorStop(0.7, '#FFE89E');
    goldGrad.addColorStop(1, '#9C680A');

    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette.violet;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FFE89E';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, r - 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = palette.gold;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 16px "Segoe UI", Arial, sans-serif';
    ctx.fillText('★ SONAR ★', cx, cy - 14);
    ctx.font = '800 11px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('AUDIOPHILE', cx, cy);
    ctx.font = '700 9px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = palette.cyan;
    ctx.fillText('192kHz / 24-BIT', cx, cy + 13);
  };

  const drawPassportVisaStamp = (x, y, w, h, title, category, unlocked) => {
    const borderColor = unlocked ? 'rgba(243, 183, 0, 0.45)' : 'rgba(220, 220, 221, 0.12)';
    const bgColor = unlocked ? 'rgba(243, 183, 0, 0.06)' : 'rgba(255, 255, 255, 0.02)';
    const textColor = unlocked ? palette.gold : palette.subtle;

    roundedRect(x, y, w, h, 14, bgColor, borderColor, 1.5);

    ctx.strokeStyle = unlocked ? 'rgba(243, 183, 0, 0.3)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 4, w - 8, h - 8, 10);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.textAlign = 'left';
    fitText(`★ ${category.toUpperCase()}`, x + 14, y + 26, w - 28, 11, textColor, 700);
    fitText(title, x + 14, y + 54, w - 28, 15, unlocked ? palette.paper : palette.subtle, 700);
    fitText(unlocked ? '✓ SELLO VALIDADO' : '○ PENDIENTE', x + 14, y + 78, w - 28, 11, unlocked ? '#10B981' : palette.subtle, 700);
  };

  const drawSonarOfficialLogo = (cx, cy, radius) => {
    const scale = radius / 60;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // 4 Overlapping Circular Petals with rich gradients
    // Top Petal
    const topG = ctx.createRadialGradient(0, -22, 2, 0, -22, 27);
    topG.addColorStop(0, 'rgba(158, 27, 41, 0.95)');
    topG.addColorStop(1, 'rgba(74, 14, 24, 0.85)');
    ctx.fillStyle = topG;
    ctx.beginPath();
    ctx.arc(0, -22, 27, 0, Math.PI * 2);
    ctx.fill();

    // Left Petal
    const leftG = ctx.createRadialGradient(-22, 0, 2, -22, 0, 27);
    leftG.addColorStop(0, 'rgba(197, 22, 19, 0.95)');
    leftG.addColorStop(1, 'rgba(107, 9, 7, 0.85)');
    ctx.fillStyle = leftG;
    ctx.beginPath();
    ctx.arc(-22, 0, 27, 0, Math.PI * 2);
    ctx.fill();

    // Bottom Petal
    const botG = ctx.createRadialGradient(0, 22, 2, 0, 22, 27);
    botG.addColorStop(0, 'rgba(27, 50, 75, 0.95)');
    botG.addColorStop(1, 'rgba(14, 26, 41, 0.85)');
    ctx.fillStyle = botG;
    ctx.beginPath();
    ctx.arc(0, 22, 27, 0, Math.PI * 2);
    ctx.fill();

    // Right Petal
    const rightG = ctx.createRadialGradient(22, 0, 2, 22, 0, 27);
    rightG.addColorStop(0, 'rgba(75, 42, 94, 0.95)');
    rightG.addColorStop(1, 'rgba(35, 17, 48, 0.85)');
    ctx.fillStyle = rightG;
    ctx.beginPath();
    ctx.arc(22, 0, 27, 0, Math.PI * 2);
    ctx.fill();

    // Outer dashed radar ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, 37, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Middle solid radar ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 21, 0, Math.PI * 2);
    ctx.stroke();

    // Center dark ring base
    ctx.fillStyle = '#1C0D1C';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Red Sonar Core
    ctx.fillStyle = '#B80C09';
    ctx.beginPath();
    ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Center White Target Point
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Base background & canvas frame
  const bgGrad = ctx.createLinearGradient(60, 60, 1180, 1700);
  bgGrad.addColorStop(0, palette.berry);
  bgGrad.addColorStop(0.35, palette.deepViolet);
  bgGrad.addColorStop(0.75, palette.violet);
  bgGrad.addColorStop(1, palette.teal);

  ctx.fillStyle = '#F5EDF3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  roundedRect(44, 44, 1152, 1666, 44, bgGrad);

  // Security guilloche perimeter line
  ctx.strokeStyle = 'rgba(243, 183, 0, 0.22)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(64, 64, 1112, 1626, 36);
  ctx.stroke();

  // Corner security brackets
  const drawCorner = (cx, cy, angle) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.strokeStyle = palette.gold;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(0, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();
    ctx.restore();
  };
  drawCorner(76, 76, 0);
  drawCorner(1164, 76, Math.PI / 2);
  drawCorner(1164, 1680, Math.PI);
  drawCorner(76, 1680, -Math.PI / 2);

  // 1. Header: Official SONAR Logo & Title & Holographic Seal
  drawSonarOfficialLogo(115, 145, 27);

  fitText('SONAR', 160, 142, 260, 38, palette.paper, 900);
  fitText('PASAPORTE AUDIÓFILO · PASSEPORT AUDIOPHILE', 162, 172, 560, 15, palette.gold, 700);

  // Holographic certified seal
  drawHolographicSeal(810, 130, 50);

  // QR Code on top right
  drawQrCode(990, 84, 110, `SONAR-PASSPORT:${passport.id}:${passport.username}`);

  // 2. User Identity Card & ID Banner
  roundedRect(90, 204, 380, 46, 23, 'rgba(0, 56, 68, 0.45)', 'rgba(220, 220, 221, 0.2)');
  fitText(passport.id, 115, 234, 330, 18, '#E9C7DE', 700);

  fitText(passport.name, 90, 310, 880, 54, palette.paper, 800);
  fitText(passport.username, 94, 348, 880, 22, palette.muted, 500);
  fitText(`RANGO OFICIAL: ${passport.rank.toUpperCase()}`, 94, 380, 880, 18, palette.cyan, 800);

  // 3. VIP Economy & Prestige Badges Row (Coins, XP, Sound Signature)
  const prestigePills = [
    [`🪙 SALDO COINS: ${passport.coins} SC`, palette.gold, 'rgba(243, 183, 0, 0.12)', 'rgba(243, 183, 0, 0.3)'],
    [`⭐ NIVEL ${passport.level} (${passport.xp} XP)`, '#FF6B68', 'rgba(184, 12, 9, 0.15)', 'rgba(184, 12, 9, 0.3)'],
    [`🎧 ${passport.soundSignature}`, palette.cyan, 'rgba(0, 56, 68, 0.4)', 'rgba(131, 209, 216, 0.3)'],
  ];
  prestigePills.forEach(([text, textColor, bg, border], idx) => {
    const x = 90 + idx * 356;
    roundedRect(x, 404, 340, 48, 24, bg, border, 1.5);
    fitText(text, x + 18, 434, 304, 14, textColor, 700);
  });

  // 4. 4 Acoustic Vital Metric Cards
  const metrics = [
    [passport.labels.saved, passport.saved],
    [passport.labels.reviews, passport.reviews],
    [passport.labels.sessions, passport.sessions],
    [passport.labels.following, passport.following],
  ];
  metrics.forEach(([label, value], index) => {
    const x = 90 + index * 268;
    roundedRect(x, 472, 252, 130, 20, palette.cardBg, palette.cardBorder);
    fitText(label.toUpperCase(), x + 18, 510, 216, 13, palette.muted, 700);
    fitText(value, x + 18, 572, 216, 44, palette.paper, 800);
  });

  // 5. Crown Jewel / Álbum Insignia del Melómano
  roundedRect(90, 622, 1060, 120, 20, 'rgba(184, 12, 9, 0.12)', 'rgba(243, 183, 0, 0.32)', 1.5);
  // Vinyl badge mini graphic
  ctx.fillStyle = '#110611';
  ctx.beginPath();
  ctx.arc(150, 682, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = palette.gold;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = palette.red;
  ctx.beginPath();
  ctx.arc(150, 682, 14, 0, Math.PI * 2);
  ctx.fill();

  fitText('💎 ÁLBUM INSIGNIA DEL PASAPORTE (MASTERPIECE RECORD)', 210, 654, 700, 13, palette.gold, 800);
  fitText(`${passport.topAlbum.title} — ${passport.topAlbum.artist} (${passport.topAlbum.year})`, 210, 688, 700, 22, palette.paper, 800);
  fitText(`Veredicto Crítico: ★ ${passport.topAlbum.rating} · Master Edition`, 210, 718, 700, 15, palette.cyan, 600);

  // 100% HI-FI Gold Badge Pill Box (perfect centered rendering)
  const badgeX = 930;
  const badgeY = 658;
  const badgeW = 190;
  const badgeH = 48;
  roundedRect(badgeX, badgeY, badgeW, badgeH, 24, 'rgba(243, 183, 0, 0.16)', palette.gold, 1.5);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = palette.gold;
  ctx.font = '800 16px "Segoe UI", Arial, sans-serif';
  ctx.fillText('100% HI-FI', badgeX + badgeW / 2, badgeY + badgeH / 2);
  ctx.restore();

  // 6. Affinity Spectrum: Top 5 Genres
  fitText(passport.labels.affinity.toUpperCase(), 90, 780, 1060, 20, palette.paper, 800);
  fitText(passport.labels.topGenres, 90, 808, 1060, 14, palette.muted, 500);

  passport.genres.forEach((genre, index) => {
    const y = 842 + index * 60;
    fitText(genre.name, 94, y, 690, 17, palette.paper, 600);
    fitText(`${genre.percentage}%`, 1080, y, 70, 16, palette.cyan, 700);
    roundedRect(94, y + 10, 1056, 10, 5, 'rgba(247, 243, 246, 0.12)');
    const bar = ctx.createLinearGradient(94, 0, 1150, 0);
    bar.addColorStop(0, palette.red);
    bar.addColorStop(0.5, '#7C3AED');
    bar.addColorStop(1, palette.cyan);
    roundedRect(94, y + 10, Math.max(12, (1056 * genre.percentage) / 100), 10, 5, bar);
  });

  // 7. Passport Visas / Unlocked Achievement Stamps
  fitText('SELLOS Y VISAS AUDIÓFILAS DESBLOQUEADAS', 90, 1184, 1060, 18, palette.gold, 800);
  const badgeStamps = (passport.badges && passport.badges.length > 0)
    ? passport.badges.slice(0, 4)
    : [
        { title: 'Oído de Alta Fidelidad', category: 'Equipamiento', unlocked: true },
        { title: 'Coleccionista 180g', category: 'Colecciones', unlocked: true },
        { title: 'Crítico Verificado', category: 'Reseñas', unlocked: true },
        { title: 'Radar de Vanguardia', category: 'Exploración', unlocked: true },
      ];

  badgeStamps.forEach((badge, idx) => {
    const x = 90 + idx * 268;
    drawPassportVisaStamp(x, 1204, 252, 92, badge.title, badge.category, badge.unlocked !== false);
  });

  // 8. Calibrated Reference Hardware Setup
  fitText(passport.labels.setup.toUpperCase(), 90, 1334, 1060, 16, palette.muted, 700);
  const setup = [
    [passport.labels.source, passport.turntable],
    [passport.labels.headphones, passport.headphones],
    [passport.labels.dac, passport.dac],
  ];
  setup.forEach(([label, value], index) => {
    const x = 90 + index * 356;
    roundedRect(x, 1354, 340, 78, 16, 'rgba(35, 17, 35, 0.5)', 'rgba(220, 220, 221, 0.14)');
    fitText(label, x + 16, 1382, 308, 13, palette.cyan, 700);
    fitText(value, x + 16, 1412, 308, 16, palette.paper, 600);
  });

  // 9. Official Certification Signatures & Footprint
  roundedRect(90, 1454, 1060, 170, 20, 'rgba(0, 0, 0, 0.28)', 'rgba(243, 183, 0, 0.24)', 1.5);

  // Left signature
  fitText('DIRECTORIO CURATORIAL SONAR', 120, 1488, 420, 13, palette.gold, 700);
  ctx.strokeStyle = 'rgba(243, 183, 0, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, 1540);
  ctx.lineTo(440, 1540);
  ctx.stroke();
  fitText('Firma: Comité Curatorial & Acoustic Lab', 120, 1560, 420, 12, palette.muted, 500);

  // Right signature
  fitText('AGENTE MODERADOR & AUDITORÍA IA', 640, 1488, 420, 13, palette.cyan, 700);
  ctx.strokeStyle = 'rgba(131, 209, 216, 0.4)';
  ctx.beginPath();
  ctx.moveTo(640, 1540);
  ctx.lineTo(960, 1540);
  ctx.stroke();
  fitText('Firma: Sonaria AI Sommelier (v2.4 Verified)', 640, 1560, 420, 12, palette.muted, 500);

  // Bottom security string & issue date
  fitText(`SHA256: e89f${passport.id.replace(/[^0-9]/g, '42')}a41c · EMISIÓN: ${passport.issueDate} · FRECUENCIA: 192 kHz / 24-bit FLAC`, 120, 1600, 1000, 12, palette.goldGlow, 600);
  fitText('DOCUMENTO OFICIAL DIGITAL EMITIDO POR SONAR AUDIO MEDIA INC. © 2026 TODOS LOS DERECHOS RESERVADOS.', 90, 1658, 1060, 12, palette.subtle, 500);

  const jpegBase64 = canvas.toDataURL('image/jpeg', 0.96).split(',')[1];
  const jpegBinary = atob(jpegBase64);
  const jpegBytes = Uint8Array.from(jpegBinary, (char) => char.charCodeAt(0));
  const encoder = new TextEncoder();
  const toBytes = (value) => encoder.encode(value);
  const pageStream = 'q 595 0 0 842 0 0 cm /Im0 Do Q\n';
  const imageStream = [
    toBytes(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`),
    jpegBytes,
    toBytes('\nendstream\nendobj\n'),
  ];
  const objects = [
    toBytes('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'),
    toBytes('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n'),
    toBytes('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n'),
    imageStream,
    toBytes(`5 0 obj\n<< /Length ${pageStream.length} >>\nstream\n${pageStream}endstream\nendobj\n`),
  ];
  const chunks = [toBytes('%PDF-1.4\n')];
  const offsets = [0];
  let byteLength = chunks[0].length;
  objects.forEach((object) => {
    offsets.push(byteLength);
    const objectChunks = Array.isArray(object) ? object : [object];
    chunks.push(...objectChunks);
    byteLength += objectChunks.reduce((sum, chunk) => sum + chunk.length, 0);
  });
  const xrefOffset = byteLength;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    xref += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  chunks.push(toBytes(xref));
  return new Blob(chunks, { type: 'application/pdf' });
};

export const AudiophilePassportTab = ({
  user,
  savedAlbums = [],
  userReviews = [],
  recentlyPlayed = [],
  followedArtists = [],
  followedUsers = [],
  gearSetup = {},
}) => {
  const ui = useUIText();
  const { t } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Generar ID audiófilo determinista o con el ID del usuario
  const passportNumber = useMemo(() => {
    const raw = String(user?.id || user?.email || 'USER8849');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const positiveCode = Math.abs(hash) % 90000 + 10000;
    return `SNR-${positiveCode}-HIFI`;
  }, [user]);

  // Cálculos de estadísticas
  const stats = useMemo(() => {
    // Calificación promedio de reseñas
    let avgRating = 0;
    if (userReviews.length > 0) {
      const sum = userReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
      avgRating = (sum / userReviews.length).toFixed(1);
    } else {
      avgRating = '5.0';
    }

    // Distribución de géneros según álbumes guardados y preferencias
    const genresCount = {};
    const prefs = user?.preferences || ['Art Rock', 'Electrónica', 'Jazz Fusion'];
    
    // Asignar base a preferencias
    prefs.forEach((pref) => {
      genresCount[pref] = (genresCount[pref] || 0) + 3;
    });

    // Sumar géneros de álbumes guardados
    savedAlbums.forEach((item) => {
      const g = item.genre || item.tag || 'Rock';
      genresCount[g] = (genresCount[g] || 0) + 1;
    });

    const totalPoints = Object.values(genresCount).reduce((a, b) => a + b, 0) || 1;
    const genreDistribution = Object.entries(genresCount)
      .map(([name, count]) => ({
        name,
        percentage: Math.min(100, Math.round((count / totalPoints) * 100)),
        count,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // Rango Audiófilo
    let rankTitle = t('passport.rank_novice', 'Melómano Iniciado');
    let rankColor = '#003844';
    if (userReviews.length >= 10 || savedAlbums.length >= 20) {
      rankTitle = t('passport.rank_master', 'Maestro de la Frecuencia');
      rankColor = '#B80C09';
    } else if (userReviews.length >= 4 || savedAlbums.length >= 8) {
      rankTitle = t('passport.rank_advanced', 'Curador Hi-Fi Avanzado');
      rankColor = '#4B2840';
    } else if (userReviews.length >= 1 || savedAlbums.length >= 3) {
      rankTitle = t('passport.rank_novice', 'Melómano Iniciado');
      rankColor = '#003844';
    }

    return {
      avgRating,
      genreDistribution,
      rankTitle,
      rankColor,
      totalSaved: savedAlbums.length,
      totalReviews: userReviews.length,
      totalHistory: recentlyPlayed.length,
      totalFollowing: followedArtists.length + followedUsers.length,
    };
  }, [user, userReviews, savedAlbums, recentlyPlayed, followedArtists, followedUsers, t]);

  // Lista de insignias y logros calculados dinámicamente
  const badges = useMemo(() => [
    {
      id: 'gear-master',
      title: 'Oído de Alta Fidelidad',
      category: 'Equipamiento',
      icon: 'headphones',
      description: 'Configuraste tu setup de audición Hi-Fi (Tornamesa, DAC o Audífonos de referencia).',
      unlocked: Boolean(gearSetup?.turntable || gearSetup?.headphones || gearSetup?.dac),
      progress: gearSetup?.turntable || gearSetup?.headphones ? 100 : 0,
      rewardText: '+150 Puntos de Prestigio Acústico',
    },
    {
      id: 'vinyl-keeper',
      title: 'Coleccionista 180g',
      category: 'Colecciones',
      icon: 'album',
      description: 'Has guardado más de 3 álbumes en tus colecciones de sonido maestro.',
      unlocked: savedAlbums.length >= 3,
      progress: Math.min(100, Math.round((savedAlbums.length / 3) * 100)),
      rewardText: 'Acceso a Filtro de Prensados Especiales',
    },
    {
      id: 'author-critic',
      title: 'Crítico Verificado',
      category: 'Reseñas',
      icon: 'rate_review',
      description: 'Publicaste al menos 2 reseñas analíticas en la comunidad de SONAR.',
      unlocked: userReviews.length >= 2,
      progress: Math.min(100, Math.round((userReviews.length / 2) * 100)),
      rewardText: 'Emblema Dorado en Comentarios',
    },
    {
      id: 'sonic-radar',
      title: 'Radar de Vanguardia',
      category: 'Exploración',
      icon: 'sensors',
      description: 'Sigues a 2 o más artistas de diferentes corrientes sonoras.',
      unlocked: followedArtists.length >= 2,
      progress: Math.min(100, Math.round((followedArtists.length / 2) * 100)),
      rewardText: 'Recomendaciones Tempranas de Lanzamientos',
    },
    {
      id: 'community-pulse',
      title: 'Conector de Onda',
      category: 'Comunidad',
      icon: 'diversity_3',
      description: 'Conectaste con otros audiófilos siguiendo sus perfiles.',
      unlocked: followedUsers.length >= 1,
      progress: Math.min(100, Math.round((followedUsers.length / 1) * 100)),
      rewardText: 'Mención en Tablón Comunitario',
    },
    {
      id: 'golden-taste',
      title: 'Gusto Exquisito',
      category: 'Afinidad',
      icon: 'award_star',
      description: 'Mantienes un estándar crítico refinado en tus valoraciones musicales.',
      unlocked: Number(stats.avgRating) >= 4.0 && userReviews.length >= 1,
      progress: userReviews.length >= 1 ? 100 : 50,
      rewardText: 'Insignia de Curaduría Destacada',
    },
  ], [gearSetup, savedAlbums, userReviews, followedArtists, followedUsers, stats.avgRating]);

  const handleCopyPassport = () => {
    const url = `${window.location.origin}/#user-profile`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDownloadPassport = () => {
    const topReview = userReviews.slice().sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))[0];
    const topAlbum = topReview
      ? {
          title: topReview.albumTitle || topReview.title || 'Aja',
          artist: topReview.artist || 'Steely Dan',
          rating: `${topReview.rating || 10}/10`,
          year: topReview.year || '1977',
        }
      : savedAlbums[0]
      ? {
          title: savedAlbums[0].title || savedAlbums[0].albumTitle || 'Abbey Road',
          artist: savedAlbums[0].artist || 'The Beatles',
          rating: '10/10',
          year: savedAlbums[0].year || '1969',
        }
      : {
          title: 'Random Access Memories',
          artist: 'Daft Punk',
          rating: '10/10',
          year: '2013',
        };

    const soundSignature = stats.genreDistribution[0]?.name?.includes('Jazz') || stats.genreDistribution[0]?.name?.includes('Rock')
      ? 'Analógico Cálido / Hi-Res Dynamic'
      : stats.genreDistribution[0]?.name?.includes('Electr')
      ? 'Respuesta Lineal / Frecuencia Extendida'
      : 'Calibración Neutra / Balance Estudio';

    const issueDate = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).toUpperCase();

    const coins = user?.coins ?? user?.sonarCoins ?? 35;
    const level = user?.level ?? 1;
    const xp = user?.experience ?? user?.xp ?? 150;

    const blob = buildPassportPdf({
      id: passportNumber,
      name: user?.name || 'Melómano Sonar',
      username: user?.username ? `@${user.username.replace('@', '')}` : '@audiophile',
      rank: stats.rankTitle,
      coins,
      level,
      xp,
      topAlbum,
      soundSignature,
      issueDate,
      badges: badges.slice(0, 4),
      labels: {
        title: t('passport.title', 'Pasaporte Audiófilo'),
        calibrated: t('passport.system_calibrated', 'Sistema calibrado'),
        rank: t('passport.rank_label', 'Rango audiófilo'),
        saved: t('passport.stat_in_collection', 'En colección'),
        reviews: t('passport.stat_critical_verdict', 'Veredicto crítico'),
        sessions: t('passport.stat_listening_sessions', 'Sesiones de escucha'),
        following: t('passport.stat_acoustic_network', 'Red acústica'),
        affinity: t('passport.affinity_distribution', 'Distribución de afinidad sonora'),
        topGenres: t('passport.top_5_genres', 'Top 5 géneros'),
        setup: t('passport.system_calibration', 'Calibración del sistema'),
        source: t('passport.preferred_source', 'Fuente preferida'),
        headphones: t('passport.headphones', 'Audífonos'),
        dac: t('passport.dac_processor', 'DAC / Procesador'),
        sampling: t('passport.sampling_rate', 'Frecuencia de muestreo'),
      },
      saved: stats.totalSaved,
      reviews: stats.totalReviews,
      sessions: stats.totalHistory,
      following: stats.totalFollowing,
      rating: stats.avgRating,
      genres: stats.genreDistribution,
      turntable: gearSetup.turntable || 'Technics Direct Drive',
      headphones: gearSetup.headphones || 'Sennheiser Open-Back',
      dac: gearSetup.dac || gearSetup.amplifier || 'Universal Audio DAC',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = (user?.username || user?.name || 'audiophile')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'audiophile';
    link.href = url;
    link.download = `sonar-pasaporte-${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="flex flex-col gap-8">
      {/* 1. TARJETA PASAPORTE AUDIÓFILO HOLOGRÁFICA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#231123] via-[#35182d] to-[#003844] text-white border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
      >
        {/* Fondo con patrones y resplandor Hi-Fi */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#B80C09]/25 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#003844]/40 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
          {/* Lado Izquierdo: Identidad y Avatar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative shrink-0">
              <div className="p-1 rounded-2xl bg-gradient-to-tr from-[#B80C09] via-white/30 to-[#003844] shadow-lg">
                {/* Avatar decide solo: foto si la hay, si no el blobatar con el
                    seed y el color del usuario. Antes eran dos ramas y median
                    72px y 96px, y solo una respetaba la configuracion.
                    Sin gaze a proposito: con los ojos siguiendo al puntero la
                    cara se ve distinta a la del perfil de arriba. */}
                <Avatar
                  {...avatarPropsFor(user)}
                  size="2xl"
                  className="w-24 h-24 sm:w-28 sm:h-28"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#B80C09] text-white text-[10px] font-black tracking-widest uppercase border border-white/20 shadow-md">
                HI-FI PRO
              </div>
            </div>

            <div className="flex flex-col text-center sm:text-left gap-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] font-mono tracking-widest text-[#DCDCDD]/70 uppercase bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10">
                  {t('passport.title', 'PASAPORTE AUDIÓFILO')} #{passportNumber}
                </span>
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t('passport.system_calibrated', 'SISTEMA CALIBRADO')}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {user?.name || t('passport.melomane_sonar', 'Melómano Sonar')}
              </h2>
              <p className="text-sm font-medium text-pink-200/80">
                {user?.username ? `@${user.username.replace('@', '')}` : '@audiophile'} {ui("• Rango:")}{' '}
                <span className="text-white font-bold">{stats.rankTitle}</span>
              </p>

              {/* Resumen de equipamiento en miniatura */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-[#4B2840]/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                  <span className="material-symbols-outlined text-[14px] text-[#B80C09]">album</span>
                  <span>{gearSetup.turntable || 'Technics Direct Drive'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-[#4B2840]/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                  <span className="material-symbols-outlined text-[14px] text-cyan-300">headphones</span>
                  <span>{gearSetup.headphones || 'Sennheiser Open-Back'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Acciones y Código QR Estilizado */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:justify-between lg:items-end gap-3 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 lg:border-l border-white/10 lg:pl-8">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPassport}
                className="px-4 py-2.5 rounded-xl bg-white text-[#231123] hover:bg-gray-100 font-bold text-xs tracking-wide transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#B80C09]">
                  {copiedLink ? 'check_circle' : 'share'}
                </span>
                <span>{copiedLink ? t('passport.link_copied', '¡Enlace Copiado!') : t('passport.share_passport', 'Compartir Pasaporte')}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPassport}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/15 flex items-center justify-center cursor-pointer"
                title={ui("Descargar Pasaporte PDF")}
                aria-label={ui("Descargar Pasaporte PDF")}
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-white/60 uppercase font-mono tracking-wider block">
                {t('passport.sampling_rate', 'Frecuencia de Muestreo')}
              </span>
              <span className="text-xs font-mono font-bold text-pink-300">
                192 kHz / 24-bit Hi-Res FLAC
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. CUADRÍCULA DE MÉTRICAS AUDIÓFILAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Métrica 1: Álbumes Guardados */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0] uppercase tracking-wider">
              {t('passport.stat_in_collection', 'EN COLECCIÓN')}
            </span>
            <span className="p-2 rounded-xl bg-red-50 dark:bg-[#B80C09]/20 text-[#B80C09]">
              <span className="material-symbols-outlined text-[20px]">collections_bookmark</span>
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-[#231123] dark:text-white">
              {stats.totalSaved}
            </span>
            <p className="text-xs text-[#5c435a] dark:text-pink-200/80 mt-1 font-medium">
              {t('passport.stat_in_collection_sub', 'Álbumes y vinilos archivados')}
            </p>
          </div>
        </motion.div>

        {/* Métrica 2: Promedio de Reseñas */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0] uppercase tracking-wider">
              {t('passport.stat_critical_verdict', 'VEREDICTO CRÍTICO')}
            </span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/20 text-amber-500">
              <span className="material-symbols-outlined text-[20px]">star</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-[#231123] dark:text-white">
                {stats.avgRating}
              </span>
              <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0]">/ 5.0</span>
            </div>
            <p className="text-xs text-[#5c435a] dark:text-pink-200/80 mt-1 font-medium">
              {stats.totalReviews} {t('passport.stat_critical_verdict_sub', 'reseñas publicadas')}
            </p>
          </div>
        </motion.div>

        {/* Métrica 3: Historial y Escuchas */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0] uppercase tracking-wider">
              {t('passport.stat_listening_sessions', 'SESIONES DE ESCUCHA')}
            </span>
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-[#003844]/40 text-[#003844] dark:text-teal-300">
              <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-[#231123] dark:text-white">
              {stats.totalHistory}
            </span>
            <p className="text-xs text-[#5c435a] dark:text-pink-200/80 mt-1 font-medium">
              {t('passport.stat_listening_sessions_sub', 'Pistas en alta definición')}
            </p>
          </div>
        </motion.div>

        {/* Métrica 4: Red Musical */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0] uppercase tracking-wider">
              {t('passport.stat_acoustic_network', 'RED ACÚSTICA')}
            </span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-[#231123] dark:text-white">
              {stats.totalFollowing}
            </span>
            <p className="text-xs text-[#5c435a] dark:text-pink-200/80 mt-1 font-medium">
              {t('passport.stat_acoustic_network_sub', 'Artistas y audiófilos seguidos')}
            </p>
          </div>
        </motion.div>
      </div>

      {/* 3. DISTRIBUCIÓN DE GÉNEROS Y AFINIDAD ACÚSTICA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución Espectral */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[22px] text-[#B80C09]">tune</span>
              <h3 className="text-base font-bold text-[#231123] dark:text-white">
                {t('passport.affinity_distribution', 'Distribución de Afinidad Sonora')}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#B80C09] dark:text-pink-300">
              {t('passport.top_5_genres', 'Top 5 Géneros')}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {stats.genreDistribution.map((item, idx) => {
              const colors = [
                'from-[#B80C09] to-[#d62828]',
                'from-[#4B2840] to-[#6a395b]',
                'from-[#003844] to-[#005f73]',
                'from-[#5c1d5e] to-[#802a83]',
                'from-amber-600 to-amber-500',
              ];
              const activeColor = colors[idx % colors.length];

              return (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#231123] dark:text-[#DCDCDD]">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#B80C09]" />
                      <span>{item.name}</span>
                    </span>
                    <span className="font-mono">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-black/30 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${activeColor}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
            {t('passport.realtime_calc_desc', 'Calculado en tiempo real en base a tus preferencias seleccionadas, reproducciones y colecciones guardadas.')}
          </p>
        </div>

        {/* Resumen de Calibración Hi-Fi */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#4B2840]/30 to-[#231123]/60 dark:from-[#35182d] dark:to-[#231123] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-teal-400">speed</span>
            <h3 className="text-base font-bold text-[#231123] dark:text-white">
              {t('passport.system_calibration', 'Calibración del Sistema')}
            </h3>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-[#e6d5e2] dark:border-white/10">
              <span className="text-[#5c435a] dark:text-pink-200/70 block text-[11px]">{t('passport.preferred_source', 'Fuente Preferida')}</span>
              <span className="font-bold text-[#231123] dark:text-white text-sm">
                {gearSetup.favoriteFormat || 'Vinilo 180g Prensado Japonés'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-[#e6d5e2] dark:border-white/10">
              <span className="text-[#5c435a] dark:text-pink-200/70 block text-[11px]">{t('passport.dac_processor', 'DAC / Procesador')}</span>
              <span className="font-bold text-[#231123] dark:text-white text-sm">
                {gearSetup.dac || 'Cambridge Audio DacMagic 200M'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-black/20 border border-[#e6d5e2] dark:border-white/10">
              <span className="text-[#5c435a] dark:text-pink-200/70 block text-[11px]">{t('passport.cartridge_needle', 'Cápsula / Aguja')}</span>
              <span className="font-bold text-[#231123] dark:text-white text-sm">
                {gearSetup.stylus || 'Ortofon 2M Blue'}
              </span>
            </div>
          </div>

          <a
            href="#audiophile_gear"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('sonar:navigate-tab', { detail: 'audiophile_gear' }));
            }}
            className="text-xs font-bold text-[#B80C09] dark:text-pink-300 hover:underline flex items-center justify-center gap-1 mt-1"
          >
            <span>{t('passport.adjust_equipment', 'Ajustar Equipamiento')}</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
        </div>
      </div>

      {/* 4. REPORTE MENSUAL & WRAPPED */}
      <AudiophileMonthlyWrapped
        user={user}
        savedCount={savedAlbums.length}
        historyCount={recentlyPlayed.length}
        reviewsCount={userReviews.length}
      />

      {/* 5. MISIONES Y DESAFÍOS SEMANALES */}
      <AudiophileQuests />

      {/* 6. MURO DE INSIGNIAS Y LOGROS AUDIÓFILOS */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-amber-500">workspace_premium</span>
            <div>
              <h3 className="text-lg font-bold text-[#231123] dark:text-white">
                {t('passport.badges_title', 'Insignias & Logros Acústicos')}
              </h3>
              <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                {t('passport.badges_subtitle', 'Desbloquea hitos escuchando, reseñando y configurando tu experiencia Hi-Fi.')}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-500/20">
            {badges.filter((b) => b.unlocked).length} / {badges.length} {t('passport.badges_unlocked_count', 'Desbloqueados')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedBadge(badge)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                badge.unlocked
                  ? 'bg-white dark:bg-[#4B2840] border-[#e6d5e2] dark:border-white/10 shadow-xs hover:border-[#B80C09]'
                  : 'bg-gray-50/70 dark:bg-black/20 border-gray-200 dark:border-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      badge.unlocked
                        ? 'bg-gradient-to-tr from-[#B80C09] to-[#003844] text-white shadow-md'
                        : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-white/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{badge.icon}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c435a] dark:text-pink-300/80">
                      {t(`passport.badges.${badge.id}.category`, { defaultValue: badge.category })}
                    </span>
                    <h4 className="text-sm font-bold text-[#231123] dark:text-white">
                      {t(`passport.badges.${badge.id}.title`, { defaultValue: badge.title })}
                    </h4>
                  </div>
                </div>

                {badge.unlocked ? (
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/20">{ui("Obtenido")}</span>
                ) : (
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                    {badge.progress}%
                  </span>
                )}
              </div>

              <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] line-clamp-2">
                {t(`passport.badges.${badge.id}.description`, { defaultValue: badge.description })}
              </p>

              <div className="pt-2 border-t border-[#e6d5e2] dark:border-white/10 flex items-center justify-between text-[11px] font-medium">
                <span className="text-[#B80C09] dark:text-pink-300 font-bold">{t(`passport.badges.${badge.id}.reward`, { defaultValue: badge.rewardText })}</span>
                <span className="material-symbols-outlined text-[14px] text-gray-400">info</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de Detalle de Insignia */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/15 shadow-2xl text-[#231123] dark:text-white flex flex-col gap-5 relative"
            >
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                    selectedBadge.unlocked
                      ? 'bg-gradient-to-tr from-[#B80C09] to-[#003844] text-white shadow-xl'
                      : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-white/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[32px]">{selectedBadge.icon}</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#B80C09] dark:text-pink-300">
                    {t(`passport.badges.${selectedBadge.id}.category`, { defaultValue: selectedBadge.category })}
                  </span>
                  <h3 className="text-lg font-black">{t(`passport.badges.${selectedBadge.id}.title`, { defaultValue: selectedBadge.title })}</h3>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {selectedBadge.unlocked ? ui("Logro Desbloqueado") : ui("Progreso actual: {{value0}}%", { value0: selectedBadge.progress })}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#5c435a] dark:text-[#DCDCDD] leading-relaxed">
                {t(`passport.badges.${selectedBadge.id}.description`, { defaultValue: selectedBadge.description })}
              </p>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-gray-400 uppercase">{ui("Recompensa Acústica")}</span>
                <span className="text-sm font-bold text-[#B80C09] dark:text-pink-200">
                  {t(`passport.badges.${selectedBadge.id}.reward`, { defaultValue: selectedBadge.rewardText })}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 rounded-xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >{ui("Entendido")}</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AudiophilePassportTab;
