"""Registry of all jurisdiction scrapers."""
from __future__ import annotations

from typing import Type

from .base import BaseScraper

from .alabama import AlabamaScraper
from .alaska import AlaskaScraper
from .arizona import ArizonaScraper
from .arkansas import ArkansasScraper
from .california import CaliforniaScraper
from .colorado import ColoradoScraper
from .connecticut import ConnecticutScraper
from .delaware import DelawareScraper
from .district_of_columbia import DistrictOfColumbiaScraper
from .federal_bop import FederalBopScraper
from .florida import FloridaScraper
from .georgia import GeorgiaScraper
from .hawaii import HawaiiScraper
from .idaho import IdahoScraper
from .illinois import IllinoisScraper
from .indiana import IndianaScraper
from .iowa import IowaScraper
from .kansas import KansasScraper
from .kentucky import KentuckyScraper
from .louisiana import LouisianaScraper
from .maine import MaineScraper
from .maryland import MarylandScraper
from .massachusetts import MassachusettsScraper
from .michigan import MichiganScraper
from .minnesota import MinnesotaScraper
from .mississippi import MississippiScraper
from .missouri import MissouriScraper
from .montana import MontanaScraper
from .nebraska import NebraskaScraper
from .nevada import NevadaScraper
from .new_hampshire import NewHampshireScraper
from .new_jersey import NewJerseyScraper
from .new_mexico import NewMexicoScraper
from .new_york import NewYorkScraper
from .north_carolina import NorthCarolinaScraper
from .north_dakota import NorthDakotaScraper
from .ohio import OhioScraper
from .oklahoma import OklahomaScraper
from .oregon import OregonScraper
from .pennsylvania import PennsylvaniaScraper
from .rhode_island import RhodeIslandScraper
from .south_carolina import SouthCarolinaScraper
from .south_dakota import SouthDakotaScraper
from .tennessee import TennesseeScraper
from .texas import TexasScraper
from .utah import UtahScraper
from .vermont import VermontScraper
from .virginia import VirginiaScraper
from .washington import WashingtonScraper
from .west_virginia import WestVirginiaScraper
from .wisconsin import WisconsinScraper
from .wyoming import WyomingScraper

SCRAPERS: dict[str, Type[BaseScraper]] = {
    "AL": AlabamaScraper,
    "AK": AlaskaScraper,
    "AZ": ArizonaScraper,
    "AR": ArkansasScraper,
    "CA": CaliforniaScraper,
    "CO": ColoradoScraper,
    "CT": ConnecticutScraper,
    "DE": DelawareScraper,
    "DC": DistrictOfColumbiaScraper,
    "FBOP": FederalBopScraper,
    "FL": FloridaScraper,
    "GA": GeorgiaScraper,
    "HI": HawaiiScraper,
    "ID": IdahoScraper,
    "IL": IllinoisScraper,
    "IN": IndianaScraper,
    "IA": IowaScraper,
    "KS": KansasScraper,
    "KY": KentuckyScraper,
    "LA": LouisianaScraper,
    "ME": MaineScraper,
    "MD": MarylandScraper,
    "MA": MassachusettsScraper,
    "MI": MichiganScraper,
    "MN": MinnesotaScraper,
    "MS": MississippiScraper,
    "MO": MissouriScraper,
    "MT": MontanaScraper,
    "NE": NebraskaScraper,
    "NV": NevadaScraper,
    "NH": NewHampshireScraper,
    "NJ": NewJerseyScraper,
    "NM": NewMexicoScraper,
    "NY": NewYorkScraper,
    "NC": NorthCarolinaScraper,
    "ND": NorthDakotaScraper,
    "OH": OhioScraper,
    "OK": OklahomaScraper,
    "OR": OregonScraper,
    "PA": PennsylvaniaScraper,
    "RI": RhodeIslandScraper,
    "SC": SouthCarolinaScraper,
    "SD": SouthDakotaScraper,
    "TN": TennesseeScraper,
    "TX": TexasScraper,
    "UT": UtahScraper,
    "VT": VermontScraper,
    "VA": VirginiaScraper,
    "WA": WashingtonScraper,
    "WV": WestVirginiaScraper,
    "WI": WisconsinScraper,
    "WY": WyomingScraper,
}

__all__ = ["SCRAPERS", "BaseScraper"]

