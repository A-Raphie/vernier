from PIL import Image, ImageDraw
import math

ARROW_IMG = Image.open("/Users/raphie/Documents/Hackathons/vernier/demo/assets/real_macos_arrow_12x18.png").convert("RGBA")
HOTSPOT_X = 1
HOTSPOT_Y = 0

def ease_in_out(t):
    t = max(0.0, min(1.0, t))
    if t < 0.5:
        return 2.0 * t * t
    else:
        return 1.0 - math.pow(-2.0 * t + 2.0, 2) / 2.0

def interpolate_segment(t, t_start, t_end, p0, p1, curve_dir=1.0):
    if t <= t_start:
        return p0[0], p0[1]
    if t >= t_end:
        dwell_t = t - t_end
        drift_x = 0.8 * math.sin(dwell_t * 1.5)
        drift_y = 0.6 * math.cos(dwell_t * 1.3)
        return p1[0] + drift_x, p1[1] + drift_y
    
    p = (t - t_start) / (t_end - t_start)
    x0, y0 = p0
    x1, y1 = p1
    dx = x1 - x0
    dy = y1 - y0
    dist = max(1.0, math.hypot(dx, dy))
    
    curve = min(90.0, dist * 0.16) * curve_dir
    cxp = (x0 + x1) / 2.0 - (dy / dist) * curve
    cyp = (y0 + y1) / 2.0 + (dx / dist) * curve
    
    overshoot = 12.0
    ox = x1 + (dx / dist) * overshoot
    oy = y1 + (dy / dist) * overshoot
    
    if p < 0.86:
        u = ease_in_out(p / 0.86)
        nx = (1.0 - u)**2 * x0 + 2.0 * (1.0 - u) * u * cxp + u**2 * ox
        ny = (1.0 - u)**2 * y0 + 2.0 * (1.0 - u) * u * cyp + u**2 * oy
    else:
        u = (p - 0.86) / 0.14
        nx = ox + (x1 - ox) * u
        ny = oy + (y1 - oy) * u
        
    return nx, ny

def draw_cursor(frame, cx, cy):
    paste_x = int(round(cx - HOTSPOT_X))
    paste_y = int(round(cy - HOTSPOT_Y))
    frame.paste(ARROW_IMG, (paste_x, paste_y), ARROW_IMG)

def draw_click_ring(frame, cx, cy, progress, color=(0, 229, 255)):
    if not (0.0 <= progress <= 1.0):
        return
    r = int(8 + 24 * progress)
    alpha = int(255 * 0.75 * (1.0 - progress))
    ring_layer = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ring_layer)
    r_color = (color[0], color[1], color[2], alpha)
    d.ellipse([(cx - r, cy - r), (cx + r, cy + r)], outline=r_color, width=3)
    comp = Image.alpha_composite(frame.convert("RGBA"), ring_layer).convert("RGB")
    frame.paste(comp, (0, 0))
