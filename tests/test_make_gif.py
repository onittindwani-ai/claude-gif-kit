import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
import check_gif_timing as t  # noqa: E402
import make_gif as g  # noqa: E402


class FrameRate(unittest.TestCase):
    def test_exact_rates(self):
        for fps in (50, 25, 20, 10):
            self.assertTrue(g.is_exact_rate(fps), fps)

    def test_uneven_rates(self):
        for fps in (30, 60, 24):
            self.assertFalse(g.is_exact_rate(fps), fps)

    def test_filter_rejects_30(self):
        with self.assertRaises(ValueError):
            g.video_filter(30, 540)

    def test_filter_50_blends(self):
        self.assertIn("framerate=fps=50", g.video_filter(50, 540))

    def test_filter_25_drops(self):
        self.assertTrue(g.video_filter(25, 540).startswith("fps=25"))

    def test_delay(self):
        self.assertEqual(g.delay_ms(50), 20.0)
        self.assertEqual(g.delay_ms(25), 40.0)


class Commands(unittest.TestCase):
    def test_gif_cmd_uses_no_dither(self):
        cmd = g.gif_cmd("a.mp4", 50, 540, "p.png", "o.gif", None)
        self.assertIn("paletteuse=dither=none", " ".join(cmd))
        self.assertEqual(cmd[-1], "o.gif")

    def test_max_seconds(self):
        cmd = g.palette_cmd("a.mp4", 50, 540, "p.png", 14.6)
        self.assertEqual(cmd[cmd.index("-t") + 1], "14.6")

    def test_hold_puts_still_first(self):
        cmds, joined = g.hold_cmds("main.png", "v.mp4", 0.6, Path("out"))
        self.assertIn("main.png", cmds[0])
        self.assertTrue(joined.endswith("gifsrc.mp4"))


class Timing(unittest.TestCase):
    def test_even(self):
        self.assertTrue(t.is_even([0.02] * 10))

    def test_uneven(self):
        self.assertFalse(t.is_even([0.03, 0.04, 0.03, 0.03]))

    def test_summary_counts(self):
        c = t.summarize([0.03, 0.04, 0.03])
        self.assertEqual(c[0.03], 2)
        self.assertEqual(c[0.04], 1)


if __name__ == "__main__":
    unittest.main()
