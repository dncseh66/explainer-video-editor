# JBL Charge 4 — reference sheet (what it really looks like, outside and in)

Everything the 3D model and the script rely on. Photos are local reference only (not used in the video).
- `product/` — JBL official product renders (front, back, top, both ends, hero), Midnight Black.
- `ifixit/` — 40 teardown photos from iFixit guides 119325 (motherboard), 119228 (battery), 119227 (speaker), 119202 (radiators) + their step JSON.
- `qucox/text.txt` — full text of the 52audio/Qucox chip-level teardown (Wayback copy; its photos were not archived).

## Specs (official unless noted)
| | value | source |
|---|---|---|
| Released | 2018 | JBL |
| Size | 220 × 95 × 93 mm (JBL rounds to 22.1 × 9.4 × 9.4 cm) | JBL support pages |
| Weight | 965 g | JBL |
| Output | 30 W RMS | JBL |
| Transducer | 1 × 50 × 90 mm racetrack (oval) driver | spec page (asokolsky), 52audio teardown |
| Bass | 2 × passive "JBL Bass Radiators", one per end | JBL |
| Frequency response | 60 Hz – 20 kHz; SNR > 80 dB | JBL |
| Battery | Li-ion, 3.6 V, 7,500 mAh = 27 Wh; 20 h playtime; 4 h charge (5 V / 2.3 A) | JBL |
| Battery pack | model IAA011NA (Brocade Energy), **3 × Samsung 18650 cells in parallel (1S3P)**, blue wrap, foam on both ends, protection board (AJ014 IC, 6 MOSFETs, 1.5 mΩ sense resistor) | 52audio teardown |
| Ports | USB-C charge in, USB-A power-bank out (5 V / 2 A), 3.5 mm aux in — on a small board behind a sealed port cover | 52audio, JBL |
| Bluetooth | 4.2 (official spec) | JBL |
| Waterproof | IPX7 | JBL |

## Chips on the main board (52audio teardown of a Sept-2020 unit)
- **Qualcomm QCC5125** Bluetooth audio SoC (on a soldered stamp module) + Macronix MX25U6435F 8 MB flash (firmware)
- **TI PCM5121** stereo DAC
- **TI TPA3128D2** class-D amplifier (2 × 30 W)
- **MPS MP3431** boost converter → up to 16 V for the amplifier (30 W, 40 W peak)
- **MPS MP2624** battery charger · **Silergy SY7065A** 5 V boost for USB-A · **TI TPS2546** USB-A port controller
- 2 × RUNIC RS622 op-amps, AWINIC AW9523B LED driver, 2 × 4R7 output inductors, 2 × 1R5 boost inductors
- Bluetooth antenna: thin-film, Southstar "CHARGE4-BT", coax to the board
(The official spec says Bluetooth 4.2; the QCC5125 is BT 5.0-capable. Don't claim 5.0 on screen.)

## Exterior (from the official renders)
- **Shape**: not a plain cylinder — a slightly barrel-shaped tube that **tapers toward both ends**, finished by a thick rubber end bumper with a **thin silver-grey rim** and a knurled edge.
- **Fabric**: fine woven mesh over top, front and back.
- **Front**: orange-red **JBL badge** (rounded square, white "JBL" with the "!" mark), centred. **5 small battery LEDs** in a row at the bottom-front edge.
- **Back**: a large stadium-shaped **rubber panel** in the lower back with a raised pill reading **CHARGE4** (covers the sealed port bay); hatched oval texture under it.
- **Top**: icons embossed in the fabric: Connect+ (bow-tie), −, a **glossy pill with Power and Bluetooth**, +, ▷ (play).
- **Bottom**: flat rubber foot so it doesn't roll.
- **Ends**: exposed passive radiators — wide black rubber surround, **grey plate with fine diagonal hatching**; one end shows the embossed **"!JBL" logo**, the other just the JBL **"!" mark**.

## Inside (from the iFixit photos)
Order of disassembly: fabric cover (2 clips + 2 screws) → radiators (clips; they also seal out water) → port-bay cover → bottom battery cover (6 screws, carries the LED board + ribbon cable) → battery → driver (4 screws, soldered red/black wires) → main board (slides out along tracks).
- **Chassis**: one black plastic tube, sealed with **orange rubber gaskets** around every opening; foam pads against rattles.
- **Driver**: on a flat face on the **front-left half** of the chassis, 4 screws. Racetrack cone, **4-point star-shaped phase plug** in the centre, black frame, large round silver magnet behind.
- **Battery**: in a bay in the **bottom-right half** (opposite end from the driver), under a long bottom cover. Blue-wrapped pack, black foam end caps, red/black wires to a white connector.
- **Main board**: long green PCB running nearly the full length along the **top** inside, in plastic tracks; slides out from an end.
- **Port board**: small separate board behind the back rubber panel (USB-C, aux, USB-A).
- **LED board**: small green board glued to the inside of the bottom cover — 6 LEDs (5 battery level + 1 Bluetooth).
- **Button board**: under a silicone keypad on top.

## Sources
- JBL support: https://support.jbl.com/ca/en/speakers/speakers-bluetooth-wireless/JBL+CHARGE+4.html · product renders: https://kh.jbl.com/bluetooth-portables/JBL+CHARGE+4.html
- iFixit guides: https://www.ifixit.com/Guide/JBL+Charge+4+Motherboard+Replacement/119325 · https://www.ifixit.com/Guide/JBL+Charge+4+Battery+Replacement/119228 · https://www.ifixit.com/Guide/JBL+Charge+4+Speaker+Replacement/119227 · https://www.ifixit.com/Guide/JBL+Charge+4+Passive+Bass+Radiators+Replacement/119202
- 52audio teardown (via Qucox, Wayback): http://web.archive.org/web/20250909074705/https://www.qucox.com/jbl-charge4-speaker-teardown/
- Spec summary: https://asokolsky.github.io/hardware/jbl-charge-4.html · SoundGuys review: https://soundguys.com/jbl-charge-4-review-20927
