import { useEffect, useMemo, useRef, forwardRef, useImperativeHandle, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Group, MeshStandardMaterial, LoopOnce, Vector3 } from "three"
import { useAnimations, useGLTF, useTexture } from "@react-three/drei"

const Modal = forwardRef((props, ref) => {
   const group = useRef<Group>(null)
   const { nodes, materials, animations, scene } = useGLTF("/assets/animations/" + process.env.NEXT_PUBLIC_ANIMATION_NAME)
   const textures = useTexture([
      "/assets/animations/textures/21.png",
      "/assets/animations/textures/22.png",
      "/assets/animations/textures/23.png",
      "/assets/animations/textures/24.png",
      "/assets/animations/textures/25.png",
      "/assets/animations/textures/26.png",
   ])
   const materialNames = [
      "ball.024",
      "ball.025",
      "ball.050",
      "ball.052",
      "ball.053",
      "ball.054",
   ]
   const { camera } = useThree()
   const [animationFinished, setAnimationFinished] = useState(false)

   const { actions } = useAnimations(animations, scene)
   const rotationAnim = actions["Cylinder.012Action.001"]
   const ballOutAnimations = [
      { action: actions["ball_out_1"], name: "out_1" },
      { action: actions["ball_out_2"], name: "out_2" },
      { action: actions["ball_out_3"], name: "out_3" },
      { action: actions["ball_out_4"], name: "out_4" },
      { action: actions["ball_out_5"], name: "out_5" },
      { action: actions["ball_out_6"], name: "out_6" },
   ]
   const ballAnimations = Array.from({ length: 26 }, (_, i) => actions[`ball.${i}Action`])
   const targetPosition = new Vector3(-2, 0, 1)

   // Expose startAnimation method to parent component
   useImperativeHandle(ref, () => ({
      startAnimation: () => {

         ballOutAnimations.forEach(({ action, name }) => {
            if (action) {
               action.reset().stop()
            }
         })

         if (rotationAnim) {
            rotationAnim.clampWhenFinished = true
            rotationAnim.setLoop(LoopOnce, 1)
            rotationAnim.reset().play()
            console.log("Wheel animation has started")
         }

         ballAnimations.forEach((ballAnim) => {
            if (ballAnim) {
               ballAnim.clampWhenFinished = true
               ballAnim.setLoop(LoopOnce, 1)
               ballAnim.reset().play()
            }
         })
      }
   }))

   useEffect(() => {

      console.log(actions)
      console.log(materials)

      materialNames.forEach((materialName, index) => {
         const material = materials[materialName] as MeshStandardMaterial | undefined
         const texture = textures[index]
   
         if (material && texture) {
           material.map = texture
           material.needsUpdate = true
         }
      })

      return () => {
         if (rotationAnim) {
            rotationAnim.stop()
         }

         ballAnimations.forEach((ballAnim) => {
            if (ballAnim) {
               ballAnim.stop()
            }
         })

         ballOutAnimations.forEach(({ action, name }) => {
            if (action) {
               action.stop()
               console.log(`Animation '${name}' stopped`)
            }
         })
      }
   }, [actions, textures, materials])

   useFrame(() => {
      if (rotationAnim) {
         // Check if the animation is near the end of its duration
         if (rotationAnim.getClip().duration - rotationAnim.time < 0.00001) {
            console.log("Wheel animation has ended")
            rotationAnim.stop()

            setAnimationFinished(true)
            ballOutAnimations.forEach(({ action, name }) => {
               if (action) {
                  action.clampWhenFinished = true
                  action.setLoop(LoopOnce, 1)
                  action.reset().play()
                  console.log(`Animation '${name}' started`)
               }
            })
         }
      }

      if (animationFinished) {
         const currentPosition = camera.position.clone()
         currentPosition.lerp(targetPosition, 0.05) // 0.05 is the interpolation factor
         camera.position.copy(currentPosition)
         camera.lookAt(0, 0, 0) // Keep the camera focused on the origin (or any target point)

         // Check if camera has reached the target position
         if (camera.position.distanceTo(targetPosition) < 0.01) {
            console.log("Camera has reached the target position")
            setAnimationFinished(false); // Reset the animation finished state if desired
         }
      }
   })

   return (
      <group ref={group} position={[0, -5, 0]}>
         <primitive object={scene} />
      </group>
   )
})

Modal.displayName = "Modal"

export default Modal
