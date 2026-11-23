export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function angDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export function circleHitsRect(cx, cy, radius, rect) {
  const nx = clamp(cx, rect.x, rect.x + rect.w);
  const ny = clamp(cy, rect.y, rect.y + rect.h);
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy < radius * radius;
}

export function hitsObstacle(x, y, radius, obstacle) {
  const dx = x - obstacle.x;
  const dy = y - obstacle.y;
  const reach = radius + obstacle.r;
  return dx * dx + dy * dy < reach * reach;
}

export function blocked(x, y, radius, walls, obstacles) {
  for (let i = 0; i < walls.length; i += 1) {
    if (circleHitsRect(x, y, radius, walls[i])) return true;
  }
  for (let i = 0; i < obstacles.length; i += 1) {
    if (hitsObstacle(x, y, radius, obstacles[i])) return true;
  }
  return false;
}

export function moveWithSlide(x, y, dx, dy, radius, walls, obstacles) {
  if (!blocked(x + dx, y + dy, radius, walls, obstacles)) {
    return { x: x + dx, y: y + dy, collided: false };
  }
  const xFree = !blocked(x + dx, y, radius, walls, obstacles);
  const yFree = !blocked(x, y + dy, radius, walls, obstacles);
  if (xFree && Math.abs(dx) >= Math.abs(dy)) return { x: x + dx, y, collided: true };
  if (yFree) return { x, y: y + dy, collided: true };
  if (xFree) return { x: x + dx, y, collided: true };
  return { x, y, collided: true };
}

export function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function pointInWall(px, py, walls) {
  for (let i = 0; i < walls.length; i += 1) {
    const wall = walls[i];
    if (px >= wall.x && px <= wall.x + wall.w && py >= wall.y && py <= wall.y + wall.h) {
      return wall;
    }
  }
  return null;
}

function pointInObstacle(px, py, obstacles) {
  for (let i = 0; i < obstacles.length; i += 1) {
    const obstacle = obstacles[i];
    const dx = px - obstacle.x;
    const dy = py - obstacle.y;
    if (dx * dx + dy * dy <= obstacle.r * obstacle.r) return obstacle;
  }
  return null;
}

export function castRay(x, y, angle, walls, obstacles, maxDist) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const step = 5;
  for (let dist = step; dist <= maxDist; dist += step) {
    const px = x + cos * dist;
    const py = y + sin * dist;
    const wall = pointInWall(px, py, walls);
    if (wall) {
      return refineHit(x, y, cos, sin, dist - step, dist, walls, obstacles, {
        kind: 'wall',
        id: wall.id,
        label: 'Structure',
      });
    }
    const obstacle = pointInObstacle(px, py, obstacles);
    if (obstacle) {
      return refineHit(x, y, cos, sin, dist - step, dist, walls, obstacles, {
        kind: 'obstacle',
        id: obstacle.id,
        label: obstacle.label,
      });
    }
  }
  return { dist: maxDist, kind: null, id: null, label: null };
}

function refineHit(x, y, cos, sin, lo, hi, walls, obstacles, hit) {
  let low = lo;
  let high = hi;
  for (let i = 0; i < 5; i += 1) {
    const mid = (low + high) / 2;
    const px = x + cos * mid;
    const py = y + sin * mid;
    const blockedPoint = pointInWall(px, py, walls) || pointInObstacle(px, py, obstacles);
    if (blockedPoint) high = mid;
    else low = mid;
  }
  return { dist: low, kind: hit.kind, id: hit.id, label: hit.label };
}

export function hasLineOfSight(x1, y1, x2, y2, walls, obstacles) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return true;
  const steps = Math.ceil(dist / 6);
  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    const px = x1 + dx * t;
    const py = y1 + dy * t;
    if (pointInWall(px, py, walls) || pointInObstacle(px, py, obstacles)) return false;
  }
  return true;
}
