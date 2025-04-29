/**
 * SEVER Network Login Background Animation
 * Enhanced version with more independent particles and blue trails
 */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize background animation canvas
  initBackgroundCanvas();

  // Create initial loading animation
  createLoadingAnimation();

  function initBackgroundCanvas() {
    const canvas = document.createElement("canvas");
    canvas.id = "backgroundCanvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "1"; // Above the grid but below content
    document.querySelector(".login-page").prepend(canvas);

    const ctx = canvas.getContext("2d");
    let particles = [];
    let width, height;
    let mouseX = -1000,
      mouseY = -1000;
    let lastMouseX = -1000,
      lastMouseY = -1000;
    let mouseSpeed = 0;
    let frame = 0;

    // Resize handler
    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      if (particles.length === 0) {
        createParticles();
      }
    }

    // Create initial particles
    function createParticles() {
      particles.length = 0;

      // Keep particle count high
      const particleCount = Math.min(Math.floor((width * height) / 4000), 300);

      for (let i = 0; i < particleCount; i++) {
        // Keep distribution with more energy particles
        let type;
        const rand = Math.random();
        if (rand < 0.4) type = "normal";
        else if (rand < 0.85) type = "energy"; // 45% energy
        else type = "data";

        // Double the particle size range
        const baseSize =
          type === "energy"
            ? (Math.random() * 2.5 + 1.5) * 2
            : type === "data"
            ? (Math.random() * 1.5 + 0.5) * 2
            : (Math.random() * 1 + 0.5) * 2;

        // Increase base speed significantly
        const speedMagnitude = 1.5;
        const baseSpeedX = (Math.random() - 0.5) * speedMagnitude;
        const baseSpeedY = (Math.random() - 0.5) * speedMagnitude;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: baseSize, // Use doubled size
          speedX: baseSpeedX, // Increased initial speed
          speedY: baseSpeedY, // Increased initial speed
          baseSpeedX: baseSpeedX,
          baseSpeedY: baseSpeedY,
          opacity: Math.random() * 0.6 + 0.3,
          type: type,
          tail: [],
          tailLength:
            type === "energy" ? Math.floor(Math.random() * 25) + 10 : 0,
          connectionRadius: Math.random() * 100 + 50,
          color: getParticleColor(type), // Ensure color matches website theme
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
          lifespan: Math.random() * 500 + 200,
          fadeState: "visible",
          fadeProgress: 0,
          movementPattern: Math.floor(Math.random() * 4),
          patternPhase: Math.random() * Math.PI * 2,
          patternAmplitude: Math.random() * 1.5 + 0.8, // Increased amplitude for more movement
          patternSpeed: Math.random() * 0.04 + 0.02, // Increased pattern speed
          changeDirectionProb: 0.01, // Increased probability to change direction
        });
      }

      // Add extra cursor follower particles (also double size)
      const followerCount = 30;
      for (let i = 0; i < followerCount; i++) {
        particles.push({
          x: width / 2,
          y: height / 2,
          size: (Math.random() * 2 + 1) * 2, // Doubled size
          speedX: 0,
          speedY: 0,
          baseSpeedX: 0,
          baseSpeedY: 0,
          opacity: Math.random() * 0.7 + 0.3,
          type: "follower",
          tail: [],
          tailLength: Math.floor(Math.random() * 8) + 3,
          connectionRadius: 80,
          color: getParticleColor("follower"), // Ensure color matches website theme
          pulseSpeed: Math.random() * 0.04 + 0.02,
          pulseOffset: Math.random() * Math.PI * 2,
          followDelay: Math.random() * 0.2,
          offsetX: (Math.random() - 0.5) * 50,
          offsetY: (Math.random() - 0.5) * 50,
        });
      }
    }

    // Get color based on particle type - Ensure accent color usage
    function getParticleColor(type) {
      const accent =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent-color-rgb")
          .trim() || "0, 255, 255"; // Default to cyan (main website color)

      // Use accent color primarily, especially for trails
      if (type === "energy") {
        return `rgba(${accent}, 0.8)`; // Use accent color for energy/trails
      } else if (type === "data") {
        // Data particles can have slight variations but keep within theme
        const dataColors = [
          accent, // Main accent color
          "0, 210, 255", // Lighter blue/cyan
          "0, 150, 200", // Deeper cyan/blue
        ];
        const color = dataColors[Math.floor(Math.random() * dataColors.length)];
        return `rgba(${color}, 0.6)`;
      } else if (type === "follower") {
        return `rgba(${accent}, 0.8)`; // Followers use accent color
      } else {
        // Normal particles
        return `rgba(${accent}, 0.4)`; // Normal use dimmer accent color
      }
    }

    // Track mouse movement
    function handleMouseMove(e) {
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Calculate mouse speed for effects
      const dx = mouseX - lastMouseX;
      const dy = mouseY - lastMouseY;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);
    }

    // Handle mouse leaving window
    function handleMouseLeave() {
      mouseX = -1000;
      mouseY = -1000;
      mouseSpeed = 0;
    }

    // Main animation loop
    function animate() {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Draw connections between particles
      drawConnections();

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.type === "follower") {
          updateFollowerParticle(p);
        } else {
          updateRegularParticle(p, i);
        }

        // Draw particle trail if it has one
        drawParticleTrail(p);

        // Calculate particle size with pulse effect
        const pulse =
          Math.sin(frame * p.pulseSpeed + p.pulseOffset) * 0.5 + 0.5;
        let size = p.size * (0.8 + pulse * 0.4);

        // If it's a follower type and mouse is moving fast, make it larger
        if (p.type === "follower" && mouseSpeed > 5) {
          size *= 1 + mouseSpeed * 0.02;
        }

        // Apply opacity based on fade state
        let displayOpacity = p.opacity;
        if (p.fadeState === "fading-out") {
          displayOpacity = p.opacity * (1 - p.fadeProgress);
        }

        // Draw the particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        // Extract base color and apply current opacity
        const baseColor = p.color.substring(0, p.color.lastIndexOf(","));
        ctx.fillStyle = `${baseColor}, ${displayOpacity})`;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    // Update follower particles that track the mouse
    function updateFollowerParticle(p) {
      // Only follow if mouse is in window
      if (mouseX > 0 && mouseY > 0) {
        // Target position with offset
        const targetX = mouseX + p.offsetX;
        const targetY = mouseY + p.offsetY;

        // Move towards target with delay factor
        p.x += (targetX - p.x) * (0.02 + p.followDelay);
        p.y += (targetY - p.y) * (0.02 + p.followDelay);

        // Add velocity based on mouse speed
        const speedInfluence = Math.min(mouseSpeed * 0.01, 0.5);
        p.speedX = (targetX - p.x) * speedInfluence;
        p.speedY = (targetY - p.y) * speedInfluence;
      }

      // Add current position to trail
      if (p.tail.length === 0 || frame % 2 === 0) {
        // Only add every other frame for performance
        p.tail.unshift({ x: p.x, y: p.y });
        if (p.tail.length > p.tailLength) {
          p.tail.pop();
        }
      }
    }

    // Update regular (non-follower) particles
    function updateRegularParticle(p, index) {
      // Apply complex movement patterns with increased amplitude/speed
      let currentSpeedX = p.speedX;
      let currentSpeedY = p.speedY;

      // Randomly change direction occasionally
      if (Math.random() < p.changeDirectionProb) {
        const speedMagnitude = 1.5; // Keep speed high on change
        p.speedX = (Math.random() - 0.5) * speedMagnitude;
        p.speedY = (Math.random() - 0.5) * speedMagnitude;
      }

      // Apply movement patterns for more interesting motion
      p.patternPhase += p.patternSpeed; // Use increased pattern speed

      // Apply pattern modifications more strongly
      const patternInfluence = 0.1; // Increased influence
      if (p.type === "energy" || p.type === "data") {
        // Apply to data too
        switch (p.movementPattern) {
          case 0: // Linear with stronger drift
            currentSpeedX +=
              Math.sin(p.patternPhase * 0.2) * patternInfluence * 0.5;
            currentSpeedY +=
              Math.cos(p.patternPhase * 0.2) * patternInfluence * 0.5;
            break;
          case 1: // Circular motion
            currentSpeedX +=
              Math.cos(p.patternPhase) * p.patternAmplitude * patternInfluence;
            currentSpeedY +=
              Math.sin(p.patternPhase) * p.patternAmplitude * patternInfluence;
            break;
          case 2: // Sine wave
            currentSpeedY +=
              Math.sin(p.patternPhase) *
              p.patternAmplitude *
              patternInfluence *
              1.5;
            break;
          case 3: // Zigzag
            if (Math.sin(p.patternPhase * 2) > 0) {
              currentSpeedX += p.patternAmplitude * patternInfluence;
            } else {
              currentSpeedX -= p.patternAmplitude * patternInfluence;
            }
            break;
        }
      }

      // Apply base movement
      p.x += currentSpeedX;
      p.y += currentSpeedY;

      // Wrap around edges
      if (p.x < -50) {
        p.x = width + 50;
        p.tail = []; // Clear trail when wrapping
      }
      if (p.x > width + 50) {
        p.x = -50;
        p.tail = []; // Clear trail when wrapping
      }
      if (p.y < -50) {
        p.y = height + 50;
        p.tail = []; // Clear trail when wrapping
      }
      if (p.y > height + 50) {
        p.y = -50;
        p.tail = []; // Clear trail when wrapping
      }

      // Mouse interaction for regular particles
      if (mouseX > 0 && mouseY > 0) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          // Calculate angle and apply force toward mouse
          const angle = Math.atan2(dy, dx);
          const force = (150 - dist) / 150;

          // Particles are attracted to cursor
          p.speedX += Math.cos(angle) * 0.03 * force;
          p.speedY += Math.sin(angle) * 0.03 * force;
        }
      }

      // Apply friction - slightly reduced friction for more sustained movement
      p.speedX *= 0.992;
      p.speedY *= 0.992;

      // Add to trail for energy type particles
      if (p.type === "energy") {
        // Add position to trail more often for smoother trails
        p.tail.unshift({ x: p.x, y: p.y });
        if (p.tail.length > p.tailLength) {
          p.tail.pop();
        }
      }

      // Particle lifecycle management
      p.lifespan--;

      if (p.lifespan <= 0) {
        // Replace with new particle
        const newType =
          Math.random() < 0.7
            ? "normal"
            : Math.random() < 0.85
            ? "energy"
            : "data";

        particles[index] = {
          x: Math.random() * width,
          y: Math.random() * height,
          size:
            newType === "energy"
              ? Math.random() * 2 + 1.5
              : newType === "data"
              ? Math.random() * 1.5 + 0.5
              : Math.random() * 1 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          baseSpeedX: (Math.random() - 0.5) * 0.5,
          baseSpeedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          type: newType,
          tail: [],
          tailLength:
            newType === "energy" ? Math.floor(Math.random() * 10) + 3 : 0,
          connectionRadius: Math.random() * 100 + 50,
          color: getParticleColor(newType),
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
          lifespan: Math.random() * 500 + 200,
          fadeState: "visible",
          fadeProgress: 0,
        };
      } else if (p.lifespan < 50 && p.fadeState === "visible") {
        // Start fading out
        p.fadeState = "fading-out";
      }

      if (p.fadeState === "fading-out") {
        p.fadeProgress = (50 - p.lifespan) / 50;
      }
    }

    // Draw particle trail with enhanced styling - ensure accent color
    function drawParticleTrail(p) {
      if (p.tail.length < 2) return;

      // Enhanced trail rendering for energy particles using accent color
      if (p.type === "energy" || p.type === "follower") {
        // Apply similar style to followers
        // Extract base color (should be accent color based on getParticleColor)
        const baseColor = p.color.substring(0, p.color.lastIndexOf(","));

        // Draw main trail
        ctx.beginPath();
        ctx.moveTo(p.tail[0].x, p.tail[0].y);
        for (let i = 1; i < p.tail.length; i++) {
          ctx.lineTo(p.tail[i].x, p.tail[i].y);
        }

        // Create gradient for fading trail
        const gradient = ctx.createLinearGradient(
          p.tail[0].x,
          p.tail[0].y,
          p.tail[p.tail.length - 1].x,
          p.tail[p.tail.length - 1].y
        );

        // Use particle's current opacity for the start of the gradient
        gradient.addColorStop(
          0,
          `${baseColor}, ${
            p.opacity * (p.fadeState === "fading-out" ? 1 - p.fadeProgress : 1)
          })`
        );
        gradient.addColorStop(1, `${baseColor}, 0)`);

        ctx.strokeStyle = gradient;
        // Adjust trail width based on doubled particle size
        ctx.lineWidth = p.size * 0.4; // Slightly thinner relative to larger particle
        ctx.stroke();

        // Add outer glow to trail using accent color
        ctx.beginPath();
        ctx.moveTo(p.tail[0].x, p.tail[0].y);
        for (let i = 1; i < p.tail.length; i++) {
          ctx.lineTo(p.tail[i].x, p.tail[i].y);
        }

        // Use accent color for glow, ensure it's derived correctly
        const accentRGB =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--accent-color-rgb")
            .trim() || "0, 255, 255";
        ctx.strokeStyle = `rgba(${accentRGB}, 0.2)`; // Glow uses accent color
        ctx.lineWidth = p.size * 0.8; // Wider glow relative to larger particle
        ctx.stroke();
      }
    }

    // Draw connections between particles - Reduced for cleaner look
    function drawConnections() {
      // Get accent color for lines
      const accent =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent-color-rgb")
          .trim() || "0, 255, 255";

      // First pass - draw fewer, more selective connections
      for (let i = 0; i < particles.length; i += 3) {
        // Only check every third particle
        const p1 = particles[i];

        // Skip if fading out
        if (p1.fadeState === "fading-out" && p1.fadeProgress > 0.5) continue;

        // Significantly reduce base connection radius for fewer lines
        let effectiveRadius = p1.connectionRadius * 0.6;

        // Only boost connection radius for particles very close to cursor
        if (mouseX > 0 && mouseY > 0) {
          const distToCursor = Math.hypot(p1.x - mouseX, p1.y - mouseY);
          if (distToCursor < 100) {
            // Reduced from 200
            effectiveRadius =
              p1.connectionRadius * (1 - (distToCursor / 100) * 0.5);
          }
        }

        // Limit the number of connections per particle to at most 2
        let connectionsMade = 0;

        for (let j = i + 1; j < particles.length; j += 2) {
          // Skip particles for fewer checks
          if (connectionsMade >= 2) break; // Hard limit of 2 connections per particle

          const p2 = particles[j];

          // Skip if p2 is fading out
          if (p2.fadeState === "fading-out" && p2.fadeProgress > 0.5) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // More strict distance checking
          const p2Radius = p2.connectionRadius * 0.6;
          const maxDist = Math.min(effectiveRadius, p2Radius);

          if (distance < maxDist && Math.random() > 0.5) {
            // Add randomness to further reduce connections
            connectionsMade++;

            // Calculate opacity - make it more subtle
            const lineOpacity = (1 - distance / maxDist) * 0.2; // Reduced from 0.4

            // Simple line instead of gradient for cleaner look
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${accent}, ${lineOpacity})`;
            ctx.lineWidth = 0.5; // Thinner lines
            ctx.stroke();
          }
        }
      }

      // Simplify cursor interactions - only draw connections to nearest 3 particles
      if (mouseX > 0 && mouseY > 0) {
        // Find particles near cursor
        const nearCursorParticles = [];

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const distToCursor = Math.hypot(p.x - mouseX, p.y - mouseY);

          if (distToCursor < 120) {
            // Reduced radius
            nearCursorParticles.push({
              particle: p,
              distance: distToCursor,
            });
          }
        }

        // Sort by distance and take only closest 3
        nearCursorParticles.sort((a, b) => a.distance - b.distance);
        const closestParticles = nearCursorParticles.slice(0, 3);

        // Connect cursor to 3 closest particles
        if (closestParticles.length > 0) {
          for (const { particle, distance } of closestParticles) {
            const opacity = 0.3 * (1 - distance / 120);

            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(particle.x, particle.y);
            ctx.strokeStyle = `rgba(${accent}, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    // Set up event listeners
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Initialize canvas and start animation
    resizeCanvas();
    animate();
  }

  // Initial loading animation - existing code
  function createLoadingAnimation() {
    // Remove any existing overlay and skip button from the entire document
    const existingOverlay = document.getElementById("loadingOverlay");
    if (existingOverlay) existingOverlay.remove();
    const existingSkip = document.querySelector(".login-skip-btn");
    if (existingSkip) existingSkip.remove();

    const overlay = document.createElement("div");
    overlay.id = "loadingOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "var(--bg-color)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.transition = "opacity 0.8s ease";

    // Create SVG for loading animation
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");
    svg.style.position = "absolute";
    svg.style.top = "50%";
    svg.style.left = "50%";
    svg.style.transform = "translate(-50%, -50%)";

    // Style for SVG elements
    const style = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style"
    );
    style.textContent = `
      .particle {
        fill: var(--accent-color);
        opacity: 0.5;
      }
      @keyframes float {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(var(--x), var(--y)); }
      }
      @keyframes energyFlow {
        0% { stroke-dashoffset: 100; }
        100% { stroke-dashoffset: 0; }
      }
      .energy-path {
        stroke: var(--accent-color);
        stroke-width: 0.5;
        fill: none;
        stroke-dasharray: 4 2;
        stroke-dashoffset: 100;
        animation: energyFlow 2s linear infinite;
      }
    `;
    svg.appendChild(style);

    // Create center hexagon
    const hexagon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    hexagon.setAttribute(
      "d",
      "M50,25 L75,37.5 L75,62.5 L50,75 L25,62.5 L25,37.5 Z"
    );
    hexagon.setAttribute("fill", "none");
    hexagon.setAttribute("stroke", "var(--accent-color)");
    hexagon.setAttribute("stroke-width", "1");
    svg.appendChild(hexagon);

    // Create energy flow paths
    const paths = [
      "M50,25 L50,10",
      "M75,37.5 L90,30",
      "M75,62.5 L90,70",
      "M50,75 L50,90",
      "M25,62.5 L10,70",
      "M25,37.5 L10,30",
    ];

    paths.forEach((d) => {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", d);
      path.setAttribute("class", "energy-path");
      svg.appendChild(path);
    });

    // Create floating particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      particle.setAttribute("cx", 50 + (Math.random() - 0.5) * 80);
      particle.setAttribute("cy", 50 + (Math.random() - 0.5) * 80);
      particle.setAttribute("r", Math.random() * 1.5 + 0.5);
      particle.setAttribute("class", "particle");

      // Set random animation values
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 2;

      particle.style.cssText = `
        --x: ${x}px;
        --y: ${y}px;
        animation: float ${duration}s ease-in-out ${delay}s infinite;
      `;

      svg.appendChild(particle);
    }

    // Create loading text
    const loadingText = document.createElement("div");
    loadingText.style.color = "var(--accent-color)";
    loadingText.style.marginTop = "120px";
    loadingText.style.fontFamily = "var(--header-font)";
    loadingText.style.fontSize = "1rem";
    loadingText.style.letterSpacing = "3px";
    loadingText.style.textTransform = "uppercase";
    loadingText.innerHTML = "Initializing...";

    // Create dots loading indicator
    const loadingDots = document.createElement("div");
    loadingDots.style.height = "20px";
    loadingDots.style.display = "flex";
    loadingDots.style.justifyContent = "center";
    loadingDots.style.marginTop = "10px";
    loadingDots.style.gap = "8px";

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.style.width = "8px";
      dot.style.height = "8px";
      dot.style.borderRadius = "50%";
      dot.style.backgroundColor = "var(--accent-color)";
      dot.style.animation = `dotPulse 1.5s ease infinite ${i * 0.3}s`;
      loadingDots.appendChild(dot);
    }

    // Create the style for dot animation
    const dotStyle = document.createElement("style");
    dotStyle.textContent = `
      @keyframes dotPulse {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }
    `;
    document.head.appendChild(dotStyle);

    // Add everything to DOM
    overlay.appendChild(svg);
    overlay.appendChild(loadingText);
    overlay.appendChild(loadingDots);

    // Add Skip button
    const skipBtn = document.createElement("button");
    skipBtn.textContent = "Skip";
    skipBtn.className = "login-skip-btn";
    skipBtn.style.position = "absolute";
    skipBtn.style.bottom = "32px";
    skipBtn.style.right = "32px";
    skipBtn.style.background = "var(--accent-color)";
    skipBtn.style.color = "#fff";
    skipBtn.style.border = "none";
    skipBtn.style.padding = "10px 24px";
    skipBtn.style.borderRadius = "6px";
    skipBtn.style.fontSize = "1rem";
    skipBtn.style.cursor = "pointer";
    skipBtn.style.zIndex = "10000";
    skipBtn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";

    // Ensure overlay is only removed once
    let overlayRemoved = false;
    function removeOverlay() {
      if (overlayRemoved) return;
      overlayRemoved = true;
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.remove();
      }, 800);
    }
    skipBtn.onclick = removeOverlay;
    overlay.appendChild(skipBtn);

    document.body.appendChild(overlay);

    // Remove loading animation after delay by simulating skip button click
    setTimeout(() => {
      if (document.body.contains(skipBtn)) {
        skipBtn.click();
      }
    }, 6000); // 6 seconds
  }
});
