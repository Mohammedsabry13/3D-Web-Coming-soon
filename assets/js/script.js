/**
 * Gravity - Creative Digital Solutions
 * Unified JavaScript: Section Navigation, Hero Slides, Options Panel, Three.js Sphere, Forms
 */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ============================================
       Section Navigation (Fullscreen Slider)
       ============================================ */
  const SectionNav = (() => {
    const slider = document.getElementById("sectionsSlider");
    const navDots = document.querySelectorAll(".nav-dot");
    const totalSections = 3;
    let activeSection = 0;
    let isTransitioning = false;

    function navigateTo(index) {
      if (
        isTransitioning ||
        index === activeSection ||
        index < 0 ||
        index >= totalSections
      )
        return;
      isTransitioning = true;
      activeSection = index;

      // Move slider
      slider.style.transform = `translateY(-${activeSection * 100}vh)`;

      // Update nav dots
      navDots.forEach((dot, i) => {
        dot.classList.toggle("active", i === activeSection);
        dot.setAttribute(
          "aria-current",
          i === activeSection ? "true" : "false",
        );
      });

      setTimeout(() => {
        isTransitioning = false;
      }, 900);
    }

    function getActive() {
      return activeSection;
    }

    // Nav dot clicks
    navDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = parseInt(dot.dataset.index, 10);
        navigateTo(index);
      });
    });

    // Arrow down button
    const arrowDown = document.getElementById("arrowDown");
    if (arrowDown) {
      arrowDown.addEventListener("click", () => navigateTo(1));
    }

    // Wheel navigation
    window.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        if (isTransitioning) return;
        if (e.deltaY > 30) {
          navigateTo(activeSection + 1);
        } else if (e.deltaY < -30) {
          navigateTo(activeSection - 1);
        }
      },
      { passive: false },
    );

    // Touch navigation
    let touchStartY = 0;
    window.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0].clientY;
      },
      { passive: true },
    );

    window.addEventListener(
      "touchend",
      (e) => {
        if (isTransitioning) return;
        const diff = touchStartY - e.changedTouches[0].clientY;
        if (diff > 50) {
          navigateTo(activeSection + 1);
        } else if (diff < -50) {
          navigateTo(activeSection - 1);
        }
      },
      { passive: true },
    );

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        navigateTo(activeSection + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        navigateTo(activeSection - 1);
      }
    });

    return { navigateTo, getActive };
  })();

  /* ============================================
       Hero Slide Rotator
       ============================================ */
  (() => {
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    }

    setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }, 5000);
  })();

  /* ============================================
       Options Panel
       ============================================ */
  (() => {
    const panel = document.getElementById("optionsPanel");
    const toggle = document.getElementById("optionsToggle");
    if (!panel || !toggle) return;

    toggle.addEventListener("click", () => {
      panel.classList.toggle("open");
    });

    // Close panel when clicking outside
    document.addEventListener("click", (e) => {
      if (panel.classList.contains("open") && !panel.contains(e.target)) {
        panel.classList.remove("open");
      }
    });

    // Option button toggle (within groups)
    const optionBtns = panel.querySelectorAll(".option-btn");
    optionBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const group = btn.dataset.group;
        const siblings = panel.querySelectorAll(
          `.option-btn[data-group="${group}"]`,
        );
        siblings.forEach((s) => s.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  })();

  /* ============================================
       Forms (Subscribe + Contact)
       ============================================ */
  (() => {
    const subscribeForm = document.getElementById("subscribeForm");
    if (subscribeForm) {
      subscribeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("subscribeEmail").value.trim();
        if (email) {
          console.log("Subscribe:", email);
          document.getElementById("subscribeEmail").value = "";
        }
      });
    }

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const message = document.getElementById("contactMessage").value.trim();
        if (name && email && message) {
          console.log("Contact:", { name, email, message });
          contactForm.reset();
        }
      });
    }
  })();

  /* ============================================
       Three.js Space Sphere Background
       ============================================ */
  (() => {
    if (typeof THREE === "undefined") return;

    const container = document.getElementById("canvas-container");
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Main group for the sphere and space
    const spaceGroup = new THREE.Group();
    scene.add(spaceGroup);

    // Surface stars on the sphere
    const surfaceStarsGeometry = new THREE.BufferGeometry();
    const surfaceStarsCount = 1200;
    const surfaceStarsPositions = new Float32Array(surfaceStarsCount * 3);
    const surfaceStarsSizes = new Float32Array(surfaceStarsCount);

    for (let i = 0; i < surfaceStarsCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 4;

      surfaceStarsPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      surfaceStarsPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      surfaceStarsPositions[i3 + 2] = radius * Math.cos(phi);

      surfaceStarsSizes[i] = Math.random() * 1.5 + 0.3;
    }

    surfaceStarsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(surfaceStarsPositions, 3),
    );
    surfaceStarsGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(surfaceStarsSizes, 1),
    );

    const surfaceStarsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 1.0,
      sizeAttenuation: true,
    });
    const surfaceStars = new THREE.Points(
      surfaceStarsGeometry,
      surfaceStarsMaterial,
    );
    spaceGroup.add(surfaceStars);

    // Lines from inside to surface
    const linesGroup = new THREE.Group();
    spaceGroup.add(linesGroup);

    const linesCount = 150;

    for (let i = 0; i < linesCount; i++) {
      const lineGeometry = new THREE.BufferGeometry();
      const linePositions = new Float32Array(6);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      // Start point (inside the sphere)
      const startRadius = Math.random() * 1.0 + 2.0;
      linePositions[0] = startRadius * Math.sin(phi) * Math.cos(theta);
      linePositions[1] = startRadius * Math.sin(phi) * Math.sin(theta);
      linePositions[2] = startRadius * Math.cos(phi);

      // End point (on or slightly outside surface)
      const endRadius = Math.random() < 0.7 ? 4 : 4 + Math.random() * 0.5;
      linePositions[3] = endRadius * Math.sin(phi) * Math.cos(theta);
      linePositions[4] = endRadius * Math.sin(phi) * Math.sin(theta);
      linePositions[5] = endRadius * Math.cos(phi);

      lineGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(linePositions, 3),
      );

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: Math.random() * 0.2 + 0.25,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(lineGeometry, lineMaterial);
      linesGroup.add(line);
    }

    // Outer transparent sphere
    const sphereGeometry = new THREE.SphereGeometry(4, 64, 64);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    spaceGroup.add(sphere);

    // Mouse interaction variables
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const spherePosition = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isHovering = false;
    let targetCameraZ = 8;
    let targetScale = 1.0;
    let currentScale = 1.0;

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    // Mouse tracking
    document.addEventListener("mousemove", (event) => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;

      mouseVector.x = mouse.targetX;
      mouseVector.y = mouse.targetY;
      raycaster.setFromCamera(mouseVector, camera);

      const intersects = raycaster.intersectObject(sphere);
      const distanceFromCenter = Math.sqrt(
        mouse.targetX * mouse.targetX + mouse.targetY * mouse.targetY,
      );

      if (distanceFromCenter > 0.7) {
        isHovering = false;
        spherePosition.targetX = 0;
        spherePosition.targetY = 0;
        targetCameraZ = 8;
        targetScale = 1.0;
        document.body.style.cursor = "default";
      } else if (intersects.length > 0) {
        isHovering = true;
        spherePosition.targetX = mouse.targetX * 1.5;
        spherePosition.targetY = mouse.targetY * 1.5;
        targetCameraZ = 0;
        targetScale = 3.0;
        document.body.style.cursor = "pointer";
      } else {
        isHovering = false;
        spherePosition.targetX = 0;
        spherePosition.targetY = 0;
        targetCameraZ = 8;
        const proximityFactor = 1 - distanceFromCenter / 0.7;
        targetScale = 1.0 + proximityFactor * 0.8;
        document.body.style.cursor = "default";
      }
    });

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Smooth sphere position
      spherePosition.x += (spherePosition.targetX - spherePosition.x) * 0.08;
      spherePosition.y += (spherePosition.targetY - spherePosition.y) * 0.08;

      spaceGroup.position.x = spherePosition.x;
      spaceGroup.position.y = spherePosition.y;

      // Smooth scale
      currentScale += (targetScale - currentScale) * 0.08;
      spaceGroup.scale.set(currentScale, currentScale, currentScale);

      // Smooth camera
      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
      camera.position.x += (spherePosition.x - camera.position.x) * 0.05;
      camera.position.y += (spherePosition.y - camera.position.y) * 0.05;
      camera.lookAt(spaceGroup.position);

      // Slow planet-like rotation
      spaceGroup.rotation.y += 0.001;
      spaceGroup.rotation.x += 0.0003;

      renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  })();
});
